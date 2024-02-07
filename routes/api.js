const express = require('express');
const userRouter = require('./User/user.router');
const GoogleUserRouter = require('./GoogleAuth/googleAuth.router');
const FacebookRouter = require('./FacebookAuth/facebookAuth.router');
const api = express.Router();

api.use('/user', userRouter);
api.use('/googleUser', GoogleUserRouter);
api.use('/facebookUser', FacebookRouter);

module.exports = api;