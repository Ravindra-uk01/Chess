import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as AppleStrategy } from 'passport-apple';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import passport from "passport";
import {db} from './db';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;


export function initPassport() {
    if(!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET ) {
        throw new Error("Missing environment variables for different OAuth providers.");
    }

    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async function(accessToken:string, refreshToken: string, profile: any, 
                done:(err: any, user?: any) => void) {
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

    // passport.use(
    //     new AppleStrategy({
    //         clientID: "",
    //         teamID: "",
    //         callbackURL: "",
    //         keyID: "",
    //         privateKeyLocation: "",
    //         passReqToCallback: true
    //     }, async function(req: any, accessToken:string, refreshToken: string, idToken: string, 
    //         profile: any, done:(err: any, user?: any) => void) {
    //             const user = await db.user.upsert({
    //                 create: {
    //                     email: profile.emails[0].value,
    //                     username: profile.displayName,
    //                     provider: 'APPLE',
    //                 },
    //                 update: {
    //                     username: profile.displayName,
    //                 },
    //                 where: {
    //                     email: profile.emails[0].value
    //                 }
    //             });

    //             return done(null, user);
    //         }
    //     )
    // )

    passport.use(
        new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: '/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'photos', 'email'],
            scope: ['email'],
        },
        async function(accessToken: string, refreshToken: string, profile: any,
            done: (err: any, user?: any) => void) {

            const email = profile.emails?.[0]?.value;
            if (!email) {
                return done(new Error('Facebook account has no accessible email address.'));
            }

            const user = await db.user.upsert({
                create: {
                    email,
                    username: profile.displayName,
                    provider: 'FACEBOOK',
                },
                update: {
                    username: profile.displayName,
                },
                where: { email }
            });

            return done(null, user);
        }
    ));


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



