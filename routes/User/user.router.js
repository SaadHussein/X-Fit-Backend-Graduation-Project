const express = require('express');
const userRouter = express.Router();
const { HelloUser, addUser, getUser, registerUser, loginUser, logoutUser, verifyEmail, forgetPassword, resetPassword } = require('./user.controller');
const jwtAuthentication = require('../../middleware/authentication');

userRouter.get('/helloUser', HelloUser);
userRouter.post('/getUser', getUser);
userRouter.post('/addUser', addUser);


userRouter.post('/register', registerUser);
userRouter.get('/verifyEmail/:token', verifyEmail);
userRouter.post('/login', loginUser);
userRouter.post('/logout', jwtAuthentication, logoutUser);
userRouter.post('/forgetPassword', forgetPassword);
userRouter.post('/resetPassword/:token', resetPassword);

module.exports = userRouter;