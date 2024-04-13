const catchAsync = require("../../middleware/catchAsync");
const { getAllEventsFromDatabase, getSelectedEventFromDatabase, createEventInDatabase, updateEventInDatabase, deleteEventInDatabase, userJoinEventInDatabase, userLeaveEventInDatabase } = require('../../models/Event/event.model');

const getAllEvents = catchAsync(async (req, res, next) => {
    const response = await getAllEventsFromDatabase();

    if (response.status === "success") {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
});

const getEvent = catchAsync(async (req, res, next) => {
    const eventID = req.params.id;
    const response = await getSelectedEventFromDatabase(eventID);

    if (response.status === "success") {
        return res.status(200).json(response);
    } else {
        return res.status(404).json(response);
    }
});

const createEvent = catchAsync(async (req, res, next) => {
    const response = await createEventInDatabase(req.body, req.user.id);

    if (response.status === "success") {
        return res.status(response.statusCode).json(response);
    } else {
        return res.status(400).json(response);
    }
});

const updateEvent = catchAsync(async (req, res, next) => {
    const eventID = req.params.id;
    const newData = req.body;
    const userID = req.user.id;
    const response = await updateEventInDatabase(eventID, newData, userID);

    if (response.status === "success") {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
});

const deleteEvent = catchAsync(async (req, res, next) => {
    const eventID = req.params.id;
    const userID = req.user.id;

    const response = await deleteEventInDatabase(eventID, userID);

    if (response.status === "success") {
        return res.status(204).json(response);
    } else {
        return res.status(400).json(response);
    }
});

const userJoinEvent = catchAsync(async (req, res, next) => {
    const eventID = req.params.id;
    const userID = req.user.id;
    const response = await userJoinEventInDatabase(eventID, userID, req.user);

    if (response.status === "success") {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
});

const userLeaveEvent = catchAsync(async (req, res, next) => {
    const eventID = req.params.id;
    const userID = req.user.id;
    const response = await userLeaveEventInDatabase(eventID, userID, req.user);

    if (response.status === "success") {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
});

module.exports = {
    getAllEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    userJoinEvent,
    userLeaveEvent,
};