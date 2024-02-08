const express = require('express');
const userRouter = require('./User/user.router');
const GoogleUserRouter = require('./GoogleAuth/googleAuth.router');
const api = express.Router();

api.use('/user', userRouter);
api.use('/googleUser', GoogleUserRouter);

module.exports = api;