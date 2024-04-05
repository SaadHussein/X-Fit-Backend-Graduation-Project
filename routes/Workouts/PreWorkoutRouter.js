const express = require("express");
const jwtAuthentication = require("../../middleware/authentication");
const { CreateUserPlan } = require("./PreWorkoutController");

const WorkoutPlanRouter = express.Router();

WorkoutPlanRouter.get("/createPlan", jwtAuthentication, CreateUserPlan);

module.exports = WorkoutPlanRouter;