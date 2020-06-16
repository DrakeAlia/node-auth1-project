const express = require("express");
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const restricted = require('./auth/restricted-middleware.js');

const usersRouter = require('./users/users-router.js');
const authRouter = require('./auth/auth-router.js');
const dbconfig = require("./data/dbconfig.js");

const server = express();

const sessionConfig = {
    name: 'monster',
    secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe!',
    cookie: {
        maxAge: 1000 * 60 * 10, 
        secure: process.env.COOKIE_SECURE || false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore ({
        knex: dbconfig,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 6000,
    }),
};


server.use(express.json());
server.use(session(sessionConfig)); // turn on sessions 

server.use('/api/users', restricted, usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
  res.status(200).json({ api: "up" });
});


module.exports = server;