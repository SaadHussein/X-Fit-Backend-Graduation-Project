const express = require('express');
const FacebookRouter = express.Router();
const passport = require('passport');
const { Strategy } = require('passport-facebook');
const checkedLoggedIn = require('../../middleware/checkLoggedIn');
require('dotenv').config();

const config = {
    ClientID: process.env.FACEBOOK_CLIENT_ID,
    ClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    CookieKeyOne: process.env.COOKIE_KEY_1,
    CookieKeyTwo: process.env.COOKIE_KEY_2,
};

const AuthOptions = {
    clientID: config.ClientID,
    clientSecret: config.ClientSecret,
    callbackURL: "http://localhost:3000/api/v1/facebookUser/auth/facebook/callback",
    profileFields: ['email', 'displayName'],
};

async function verifyCallback(accessToken, refreshToken, profile, done) {
    console.log(profile);
    done(null, profile);
}

passport.use(new Strategy(AuthOptions, verifyCallback));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

FacebookRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

FacebookRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/failer',
    successRedirect: '/signed',
    session: true,
}), (req, res) => {
    console.log('Facebook Called Us Back');
});

FacebookRouter.get('/auth/logout', checkedLoggedIn, (req, res) => {
    req.logout();
    return res.redirect('http://localhost:3000');
});

module.exports = FacebookRouter;