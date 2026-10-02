import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { initPassport } from "./passport";
dotenv.config();

const PORT = process.env.PORT;
console.log("port is PORT ", PORT)
const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000  }
}));

initPassport(); // Initialize passport strategies
app.use(passport.initialize());
app.use(passport.authenticate('session'));

const allowedHosts = process.env.ALLOWED_HOSTS?.split(',') || ['http://localhost:5173'];
app.use(cors({
    origin: allowedHosts,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
})) 

app.get('/', (req, res)=>{
    return res.json({
        "message": "working fine",
        "status": 'success'
    })
})

app.listen(PORT, ()=>{
    console.log(`server is listening in port ${PORT} `);
})