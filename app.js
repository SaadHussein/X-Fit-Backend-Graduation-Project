require('express-async-errors');
require('dotenv').config();

const xss = require('xss-clean');
const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const app = express();
const path = require("path");
const cookieSession = require('cookie-session');
const api = require('./routes/api');
const passport = require('passport');
const checkedLoggedIn = require('./middleware/checkLoggedIn');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(cookieSession({
    name: "session",
    maxAge: 1000 * 60 * 60 * 24 * 30,
    keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2]
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/v1', api);

app.get('/', (req, res) => {
    res.status(200).send(`<h1>Welcome To X-Fit</h1>`);
});

app.use(notFound);
app.use(errorHandlerMiddleware);

module.exports = app;