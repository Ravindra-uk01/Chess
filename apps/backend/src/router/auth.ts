import { Request, Response, Router } from "express";
import passport from "passport";

const router = Router();
const CLIENT_URL =
  process.env.AUTH_REDIRECT_URL ?? 'http://localhost:5173/game/random';

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