import { Request, Response, Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const CLIENT_URL =
  process.env.AUTH_REDIRECT_URL ?? 'http://localhost:5173/game/random';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const COOKIE_MAX_AGE = Number(process.env.COOKIE_MAX_AGE ?? 24 * 60 * 60 * 1000);

interface UserDetails {
  id: string;
  token?: string;
  name: string;
  isGuest?: boolean;
}

// this route is to be hit when the user wants to login as a guest
router.post('/guest', async (req: Request, res: Response) => {
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
  const { username, email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const existingUser = await db.user.findFirst({
    where: {
      OR: [
        { email },
        ...(username ? [{ username }] : []),
      ],
    },
  });

  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const displayName = name || username || email.split('@')[0];
  const user = await db.user.create({
    data: {
      username: username || email.split('@')[0],
      email,
      password,
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

// Manual login by email
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = await db.user.findFirst({
    where: {
      OR: [
        { email },
        { username: email },
      ],
    },
  });

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const displayName = user.name || user.username || user.email.split('@')[0];
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