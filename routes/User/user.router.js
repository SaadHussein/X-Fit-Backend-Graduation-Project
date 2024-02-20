const express = require('express');
const userRouter = express.Router();
const { HelloUser, addUser, getUser, registerUser, loginUser, logoutUser, verifyEmail, forgetPassword, resetPassword, createUser, completeUserData } = require('./user.controller');
const jwtAuthentication = require('../../middleware/authentication');

userRouter.get('/helloUser', HelloUser);
userRouter.post('/getUser', getUser);
userRouter.post('/addUser', addUser);

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', jwtAuthentication, logoutUser);
userRouter.get('/verifyEmail/:token', verifyEmail);
userRouter.post('/forgetPassword', forgetPassword);
userRouter.post('/resetPassword/:token', resetPassword);

userRouter.post('/createUser', createUser);
userRouter.patch('/completeUserData', completeUserData);

module.exports = userRouter;