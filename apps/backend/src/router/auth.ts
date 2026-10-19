import { Request, Response, Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { db } from "../db";
import { v4 as uuidv4 } from 'uuid';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth";
import { sendPasswordResetEmail } from "../services/email";

const router = Router();
const CLIENT_URL =
  process.env.AUTH_REDIRECT_URL ?? 'http://localhost:5173/game/random';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const COOKIE_MAX_AGE = Number(process.env.COOKIE_MAX_AGE ?? 24 * 60 * 60 * 1000);
const COOKIE_MAX_AGE_REMEMBER = 30 * 24 * 60 * 60 * 1000; // 30 days
const BCRYPT_SALT_ROUNDS = 10;

// Rate limiter to prevent abusive guest creation: 5 guests per hour per IP
const guestRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Rate limit exceeded: You can only create 5 guest sessions per hour from this IP.',
  },
});

interface UserDetails {
  id: string;
  token?: string;
  name: string;
  isGuest?: boolean;
}

// this route is to be hit when the user wants to login as a guest
router.post('/guest', guestRateLimiter, async (req: Request, res: Response) => {
  const bodyData = req.body;
  let guestUUID = 'guest-' + uuidv4();

  const user = await db.user.create({
    data: {
      username: guestUUID,
      email: guestUUID + '@chess100x.com',
      name:  guestUUID,
      provider: 'GUEST',
    },
  });

  const token = jwt.sign(
    { userId: user.id, name: user.name, isGuest: true },
    JWT_SECRET,
  );
  const UserDetails: UserDetails = {
    id: user.id,
    name: user.name!,
    token: token,
    isGuest: true,
  };
  res.cookie('guest', token, { maxAge: COOKIE_MAX_AGE, httpOnly: true, sameSite: 'lax' });
  res.json(UserDetails);
});

// Manual register by email
router.post('/register', async (req: Request, res: Response) => {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: parseResult.error.issues[0].message,
      errors: parseResult.error.issues,
    });
  }

  const { username, email, password, name } = parseResult.data;

  const existingUser = await db.user.findFirst({
    where: {
      OR: [
        { email },
        { username },
      ],
    },
  });

  if (existingUser) {
    const isEmailTaken = existingUser.email.toLowerCase() === email.toLowerCase();
    const message = isEmailTaken
      ? 'An account with this email already exists'
      : 'This username is already taken. Please choose another one.';
    return res.status(400).json({ success: false, message });
  }

  // Hash password using bcrypt before persisting
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const displayName = name || username || email.split('@')[0];
  const user = await db.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      name: displayName,
      provider: 'EMAIL',
    },
  });

  const token = jwt.sign(
    { userId: user.id, name: displayName, isGuest: false },
    JWT_SECRET,
  );

  res.cookie('token', token, { maxAge: COOKIE_MAX_AGE, httpOnly: true, sameSite: 'lax' });
  return res.json({
    id: user.id,
    name: displayName,
    token,
    isGuest: false,
  });
});

// Manual login by email or username
router.post('/login', async (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: parseResult.error.issues[0].message,
      errors: parseResult.error.issues,
    });
  }

  const { email: identifier, password } = parseResult.data;
  const user = await db.user.findFirst({
    where: {
      OR: [
        { email: identifier.toLowerCase() },
        { username: identifier },
      ],
    },
  });

  if (!user || !user.password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Verify password with bcrypt; support opportunistic upgrade for any legacy plain-text passwords
  let isPasswordValid = false;
  if (user.password.startsWith('$2')) {
    isPasswordValid = await bcrypt.compare(password, user.password);
  } else {
    isPasswordValid = user.password === password;
    if (isPasswordValid) {
      // Seamlessly upgrade legacy plain text password to bcrypt
      const upgradedHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      await db.user.update({
        where: { id: user.id },
        data: { password: upgradedHash },
      });
    }
  }

  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const displayName = user.name || user.username || user.email.split('@')[0];
  const token = jwt.sign(
    { userId: user.id, name: displayName, isGuest: false },
    JWT_SECRET,
  );

  const rememberMe = Boolean(req.body.rememberMe);
  const cookieMaxAge = rememberMe ? COOKIE_MAX_AGE_REMEMBER : COOKIE_MAX_AGE;

  res.cookie('token', token, { maxAge: cookieMaxAge, httpOnly: true, sameSite: 'lax' });
  return res.json({
    id: user.id,
    name: displayName,
    token,
    isGuest: false,
  });
});

// Request password reset link by email
router.post('/forgot-password', async (req: Request, res: Response) => {
  const parseResult = forgotPasswordSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: parseResult.error.issues[0].message,
    });
  }

  const { email } = parseResult.data;

  // Find user by email
  const user = await db.user.findFirst({
    where: { email: email.toLowerCase() },
  });

  // If user exists and is an email account, generate reset token
  if (user && user.provider === 'EMAIL') {
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email, purpose: 'reset-password' },
      JWT_SECRET,
      { expiresIn: '15m' },
    );

    const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
    const resetUrl = `${clientOrigin}/reset-password?token=${encodeURIComponent(resetToken)}`;

    await sendPasswordResetEmail({
      to: user.email,
      resetUrl,
      userName: user.name || user.username || undefined,
    });
  }

  // Consistent security response: do not leak whether email exists
  return res.json({
    success: true,
    message: 'If an account exists with that email, a password reset link has been sent.',
  });
});

// Reset password using verified token
router.post('/reset-password', async (req: Request, res: Response) => {
  const parseResult = resetPasswordSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: parseResult.error.issues[0].message,
    });
  }

  const { token, password } = parseResult.data;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId?: string;
      email?: string;
      purpose?: string;
    };

    if (!decoded || decoded.purpose !== 'reset-password' || !decoded.userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
    }

    const user = await db.user.findFirst({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User account not found.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return res.json({
      success: true,
      message: 'Your password has been reset successfully. You can now log in.',
    });
  } catch {
    return res.status(400).json({
      success: false,
      message: 'Password reset link has expired or is invalid. Please request a new one.',
    });
  }
});

router.get('/refresh', async (req: Request, res: Response) => {
  // 1. Authenticated via passport session (OAuth users: Google, Facebook, etc.)
  if (req.user) {
    const user = req.user as any;
    const userData = await db.user.findFirst({ where: { id: user.id } });
    const displayName = userData?.name || userData?.username || user.name || user.username || 'User';
    const userId = userData?.id || user.id;

    const token = jwt.sign(
      { userId, name: displayName, isGuest: false },
      JWT_SECRET,
    );
    return res.json({
      id: userId,
      name: displayName,
      token,
      isGuest: false,
    });
  }

  // 2. Cookie or Bearer token based auth (Guest or Manual Email token)
  const cookieHeader = req.headers.cookie || '';
  const authHeader = req.headers.authorization;

  const guestCookieMatch = cookieHeader.match(/(?:^|;\s*)guest=([^;]+)/);
  const tokenCookieMatch = cookieHeader.match(/(?:^|;\s*)(?:jwt|token)=([^;]+)/);

  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const authToken = tokenFromHeader || tokenCookieMatch?.[1];
  const guestToken = guestCookieMatch?.[1];

  // Guest users
  if (guestToken) {
    try {
      const decoded = jwt.verify(guestToken, JWT_SECRET) as any;
      const userData = await db.user.findFirst({ where: { id: decoded.userId } });
      if (userData && userData.provider === 'GUEST') {
        const freshToken = jwt.sign(
          { userId: decoded.userId, name: decoded.name ?? userData.name ?? userData.username, isGuest: true },
          JWT_SECRET,
        );
        return res.json({
          id: userData.id,
          name: userData.username ?? decoded.name,
          token: freshToken,
          isGuest: true,
        });
      }
    } catch {
      // invalid or expired guest cookie — fall through
    }
  }

  // Manual / Email JWT users
  if (authToken) {
    try {
      const decoded = jwt.verify(authToken, JWT_SECRET) as any;
      const userData = await db.user.findFirst({ where: { id: decoded.userId } });
      if (userData) {
        const isGuest = userData.provider === 'GUEST';
        const displayName = decoded.name ?? userData.name ?? userData.username ?? '';
        const freshToken = jwt.sign(
          { userId: decoded.userId, name: displayName, isGuest },
          JWT_SECRET,
        );
        return res.json({
          id: userData.id,
          name: userData.username ?? displayName,
          token: freshToken,
          isGuest,
        });
      }
    } catch {
      // invalid or expired token — fall through to 401
    }
  }

  return res.status(401).json({ success: false, message: 'Unauthorized' });
});

router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed', error: err });
    }
    res.clearCookie('jwt');
    res.clearCookie('token');
    res.clearCookie('guest');
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  });
});

router.get('/login/failed', (req: Request, res: Response) => {
  res.status(401).json({ success: false, message: 'failure' });
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', 
    { 
        successRedirect: CLIENT_URL,
        failureRedirect: '/login/failed' 
    }
  )
);

router.get('/apple',
  passport.authenticate('apple', { scope: ['email', 'name'] }));

router.get('/apple/callback', 
  passport.authenticate('apple', 
    { 
        successRedirect: CLIENT_URL,
        failureRedirect: '/login/failed' 
    }
  )
);

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', 
  passport.authenticate('facebook', 
    { 
        successRedirect: CLIENT_URL,
        failureRedirect: '/login/failed' 
    }
  )
);

export default router;