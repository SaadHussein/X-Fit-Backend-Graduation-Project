const express = require('express');
const userRouter = require('./User/user.router');
const GoogleUserRouter = require('./GoogleAuth/googleAuth.router');
const CircleRouter = require('./Circle/circle.router');
const api = express.Router();

api.use('/user', userRouter);
api.use('/googleUser', GoogleUserRouter);
api.use('/circle', CircleRouter);

module.exports = api;