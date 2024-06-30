const mongoose = require('mongoose');
const User = require("../User/user.mongo");

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event must have a name']
    },
    eventImage: {
        type: String
    },
    address: {
        type: String,
        required: [true, "Event must have an address"]
    },
    description: {
        type: String,
        required: [true, "Event must have a description"]
    },
    eventImage: {
        type: String,
    },
    numberOfPeopleRequired: {
        type: Number,
        required: [true, "Event must have a number of people to complete event"]
    },
    eventStartDate: {
        type: Date,
        required: [true, "Event must have a start Date."]
    },
    eventOrganizerID: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, 'Event must have an organizer.']
    },
    usersJoined: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);