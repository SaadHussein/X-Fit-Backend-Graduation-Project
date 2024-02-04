const express = require('express');
const GoogleUserRouter = express.Router();
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const checkedLoggedIn = require('../../middleware/checkLoggedIn');
const { signWithGoogleAccount } = require('./googleAuth.controller');
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
    callbackURL: "http://localhost:3000/api/v1/googleUser/auth/google/callback"
};

async function verifyCallback(accessToken, refreshToken, profile, done) {
    const responseProfile = await signWithGoogleAccount(profile);
    done(null, responseProfile);
}

passport.use(new Strategy(AuthOptions, verifyCallback));

passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log(user);
    done(null, user);
});

GoogleUserRouter.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

GoogleUserRouter.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/failer',
    successRedirect: '/signed',
    session: true,
}), (req, res) => {
    console.log('Google Called Us Back');
});

GoogleUserRouter.get('/auth/logout', checkedLoggedIn, (req, res) => {
    req.logout();
    return res.redirect('http://localhost:3000');
});

module.exports = GoogleUserRouter;