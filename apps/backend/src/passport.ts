var GoogleStrategy = require('passport-google-oauth20').Strategy;
import passport from "passport";

import {db} from './db';


console.log('db is here ', db);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


export function initPassport() {
    if(!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        throw new Error("Missing environment variables for different OAuth providers.");
    }

    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: "http://www.example.com/auth/google/callback"
            },
            async function(accessToken:string, refreshToken: string, profile: any, done:(err: any, user?: any) => void) {
                
                const user = await db.user.upsert({
                    create: {
                        email: profile.emails[0].value,
                        username: profile.displayName,
                        provider: 'GOOGLE',
                    },
                    update: {
                        username: profile.displayName,
                    },
                    where: {
                        email: profile.emails[0].value
                    }
                });

                return done(null, user);
            }
        )
    ); 

    passport.serializeUser(function(user: any, cb: Function) {
        process.nextTick(function() {
            return cb(null, { id: user.id, username: user.username, picture: user.picture });
        });
    });

    passport.deserializeUser(function(user: any, cb: Function) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });
}



