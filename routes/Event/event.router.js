const express = require('express');
const eventRouter = express.Router();
const { getAllEvents, getEvent, createEvent, updateEvent, deleteEvent, userJoinEvent, userLeaveEvent } = require("./event.controller");
const jwtAuthentication = require('../../middleware/authentication');

eventRouter.use(jwtAuthentication);

eventRouter.route('/').get(getAllEvents).post(createEvent);
eventRouter.route('/:id').get(getEvent).patch(updateEvent).delete(deleteEvent);
eventRouter.route("/joinEvent/:id").get(userJoinEvent);
eventRouter.route("/leaveEvent/:id").get(userLeaveEvent);

module.exports = eventRouter;