import { Request, Response, Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { db } from "../db";

const router = Router();
const CLIENT_URL =
  process.env.AUTH_REDIRECT_URL ?? 'http://localhost:5173/game/random';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

router.get('/refresh', async(req: Request, res: Response) => {
  if(req.user){
    const user = req.user as any; 
    const userData = await db.user.findFirst({
      where: { id: user.id },
    })

    const token = jwt.sign(
      { id: user.id }, 
      JWT_SECRET
    );

    res.json({ 
      success: true, 
      token,
      name : userData?.username,
      id : userData?.id,
     });
  }else{
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed', error: err });
    }
    res.clearCookie('jwt'); 
    res.redirect('http://localhost:5173/');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  })
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