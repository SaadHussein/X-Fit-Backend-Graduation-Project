const express = require('express');
const { createCircle, addMemberToCircle, getCircle, deleteCircle, removeMember, memberLeave, updateCircle, addMemberWithInvitationLink } = require('./circle.controller');
const jwtAuthentication = require('../../middleware/authentication');
const CircleRouter = express.Router();

CircleRouter.post('/', jwtAuthentication, createCircle);
CircleRouter.post('/addMemberToCircle', jwtAuthentication, addMemberToCircle);
CircleRouter.post('/getCircle', jwtAuthentication, getCircle);
CircleRouter.put('/updateCircle', jwtAuthentication, updateCircle);
CircleRouter.delete('/deleteCircle', jwtAuthentication, deleteCircle);
CircleRouter.delete('/removeMember', jwtAuthentication, removeMember);
CircleRouter.delete('/memberLeave', jwtAuthentication, memberLeave);
CircleRouter.get('/invite/:teamID', jwtAuthentication, addMemberWithInvitationLink);

module.exports = CircleRouter;