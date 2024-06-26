const express = require('express');
const { getAllCircles, createCircle, addMemberToCircle, getCircle, deleteCircle, removeMember, memberLeave, updateCircle, addMemberWithInvitationLink, joinCircle, memberJoinCircle } = require('./circle.controller');
const jwtAuthentication = require('../../middleware/authentication');
const CircleRouter = express.Router();

CircleRouter.get("/all-circles", getAllCircles);
CircleRouter.post('/', jwtAuthentication, createCircle);
CircleRouter.get("/member-join/:circleID", jwtAuthentication, memberJoinCircle);
CircleRouter.post('/addMemberToCircle', jwtAuthentication, addMemberToCircle);
CircleRouter.post('/getCircle', jwtAuthentication, getCircle);
CircleRouter.put('/updateCircle', jwtAuthentication, updateCircle);
CircleRouter.delete('/deleteCircle', jwtAuthentication, deleteCircle);
CircleRouter.delete('/removeMember', jwtAuthentication, removeMember);
CircleRouter.delete('/memberLeave', jwtAuthentication, memberLeave);
CircleRouter.get('/invite/:teamID', jwtAuthentication, addMemberWithInvitationLink);
CircleRouter.get("/join/:circleID", joinCircle);

module.exports = CircleRouter;