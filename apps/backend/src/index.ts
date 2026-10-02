import 'dotenv/config';   // ← MUST be first: sets process.env before any other import runs
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { initPassport } from "./passport";
import authRouter from "./router/auth";
import bodyParser from 'body-parser';

const PORT = process.env.PORT;
const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000  }
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.use('/auth', authRouter);

app.listen(PORT, ()=>{
    console.log(`server is listening in port ${PORT} `);
})