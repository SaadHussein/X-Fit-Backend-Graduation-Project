const express = require('express');
const { createCircle, addMemberToCircle, getCircle, deleteCircle } = require('./circle.controller');
const jwtAuthentication = require('../../middleware/authentication');
const CircleRouter = express.Router();

CircleRouter.post('/', jwtAuthentication, createCircle);
CircleRouter.post('/addMemberToCircle', jwtAuthentication, addMemberToCircle);
CircleRouter.post('/getCircle', jwtAuthentication, getCircle);
CircleRouter.delete('/deleteCircle', jwtAuthentication, deleteCircle);

module.exports = CircleRouter;