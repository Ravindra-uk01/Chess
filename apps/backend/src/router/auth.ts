import express from "express";
const router = express.Router();
import passport from "passport";

const CLIENT_URL =
  process.env.AUTH_REDIRECT_URL ?? 'http://localhost:5173/game/random';

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', 
    { 
        successRedirect: CLIENT_URL,
        failureRedirect: '/login' 
    })
  );

export default router;