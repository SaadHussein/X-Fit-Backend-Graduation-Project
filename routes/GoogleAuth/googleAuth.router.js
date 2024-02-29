const express = require('express');
const GoogleUserRouter = express.Router();
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const checkedLoggedIn = require('../../middleware/checkLoggedIn');
const { signWithGoogleAccount, completeRegister, logoutAccountWithGoogle, createUserwhenIntegrateWithFlutter } = require('./googleAuth.controller');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

const config = {
    ClientID: process.env.GOOGLE_CLIENT_ID,
    ClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    CookieKeyOne: process.env.COOKIE_KEY_1,
    CookieKeyTwo: process.env.COOKIE_KEY_2,
};

const AuthOptions = {
    clientID: config.ClientID,
    clientSecret: config.ClientSecret,
    callbackURL: process.env.ENVIRONMENT === 'DEVELOPMENT' ? "http://localhost:3000/api/v1/googleUser/auth/google/callback" : "https://x-fit-backend-graduation-project.onrender.com/api/v1/googleUser/auth/google/callback"
};

async function verifyCallback(accessToken, refreshToken, profile, done) {
    const responseProfile = await signWithGoogleAccount(profile);
    done(null, responseProfile);
}

passport.use(new Strategy(AuthOptions, verifyCallback));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

GoogleUserRouter.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

GoogleUserRouter.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: "/",
    session: true,
}), (req, res) => {
    console.log('Google Called Us Back');
    console.log(req.user);
    res.status(StatusCodes.OK).json(req.user);
});

GoogleUserRouter.get('/auth/logout/:id', checkedLoggedIn, logoutAccountWithGoogle);

GoogleUserRouter.post('/completeRegister', completeRegister);

GoogleUserRouter.post('/createUser', createUserwhenIntegrateWithFlutter);

module.exports = GoogleUserRouter;