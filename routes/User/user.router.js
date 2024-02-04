const express = require('express');
const userRouter = express.Router();
const { HelloUser, addUser, getUser, registerUser, loginUser, logoutUser } = require('./user.controller');
const jwtAuthentication = require('../../middleware/authentication');

userRouter.get('/helloUser', HelloUser);
userRouter.post('/getUser', getUser);
userRouter.post('/addUser', addUser);


userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.post('/logout', jwtAuthentication, logoutUser);

module.exports = userRouter;