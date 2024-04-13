const express = require('express');
const userRouter = require('./User/user.router');
const GoogleUserRouter = require('./GoogleAuth/googleAuth.router');
const CircleRouter = require('./Circle/circle.router');
const EventRouter = require('./Event/event.router');
const WorkoutPlanRouter = require("./Workouts/PreWorkoutRouter");
const api = express.Router();

api.use('/user', userRouter);
api.use('/googleUser', GoogleUserRouter);
api.use('/circle', CircleRouter);
api.use('/event', EventRouter);
api.use('/workouts/', WorkoutPlanRouter);

module.exports = api;