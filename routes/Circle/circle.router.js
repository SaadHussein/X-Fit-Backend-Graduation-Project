const express = require('express');
const { createCircle } = require('./circle.controller');
const jwtAuthentication = require('../../middleware/authentication');
const CircleRouter = express.Router();

CircleRouter.post('/', jwtAuthentication, createCircle);

module.exports = CircleRouter;