const express = require('express');
const { createCircle, addMemberToCircle } = require('./circle.controller');
const jwtAuthentication = require('../../middleware/authentication');
const CircleRouter = express.Router();

CircleRouter.post('/', jwtAuthentication, createCircle);
CircleRouter.post('/addMemberToCircle', jwtAuthentication, addMemberToCircle);

module.exports = CircleRouter;