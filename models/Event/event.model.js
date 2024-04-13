const Event = require("./event.mongo");
const User = require("../User/user.mongo");

const getAllEventsFromDatabase = async () => {
    try {
        const events = await Event.find();

        if (events.length === 0) {
            return {
                status: "fail",
                message: "There are no Events yet."
            };
        }

        return {
            status: "success",
            data: {
                events
            }
        };
    } catch (error) {
        return {
            status: "fail",
            message: "Error Happened.",
            error
        };
    }
};

const getSelectedEventFromDatabase = async (eventID) => {
    try {
        const selectedEvent = await Event.findById(eventID).populate('eventOrganizerID usersJoined');

        if (!selectedEvent) {
            return {
                status: "fail",
                message: "Event Not Found.",
            };
        }

        return {
            status: "success",
            data: {
                selectedEvent
            }
        };
    } catch (error) {
        return {
            status: "fail",
            message: "Error Happened.",
            error
        };
    }
};

const createEventInDatabase = async (eventData, userID) => {
    try {
        if (userID !== eventData.eventOrganizerID) {
            return {
                status: "fail",
                message: "Not Authenticated.!",
            };
        }

        const newEvent = await Event.create(eventData);
        const user = await User.findById(userID);

        if (!user) {
            return {
                status: "fail",
                message: "User Not Found with This ID."
            };
        }

        newEvent.usersJoined.push(userID);
        await newEvent.save();

        user.eventsJoined.push(newEvent.id);
        await user.save();

        return {
            status: "success",
            statusCode: 201,
            message: "Event Created.",
            data: {
                newEvent,
            }
        };
    } catch (error) {
        return {
            status: "fail",
            message: "Error Happened.",
            error
        };
    }
};

const updateEventInDatabase = async (eventID, newData, userID) => {
    try {
        const selectedEvent = await Event.findById(eventID);
        const adminUser = await User.findById(userID);

        if (!selectedEvent) {
            return {
                status: "fail",
                message: "Event Not Found with This ID."
            };
        }

        if (!adminUser) {
            return {
                status: "fail",
                message: "User Not Found with This ID."
            };
        }

        console.log(userID, selectedEvent.eventOrganizerID.toString());
        if (userID !== selectedEvent.eventOrganizerID.toString()) {
            return {
                status: "fail",
                message: "Only Admin Can Update Event Data."
            };
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventID, newData, {
            new: true,
            runValidators: true
        });

        return {
            status: "success",
            event: updatedEvent,
            message: "Event Updated Successfully."
        };
    } catch (error) {
        return {
            status: "fail",
            message: "Error Happened.",
            error
        };
    }
};

const deleteEventInDatabase = async (eventID, userID) => {
    try {
        const selectedEvent = await Event.findById(eventID);
        const adminUser = await User.findById(userID);

        if (!selectedEvent) {
            return {
                status: "fail",
                message: "Event Not Found with This ID."
            };
        }

        if (!adminUser) {
            return {
                status: "fail",
                message: "User Not Found with This ID."
            };
        }

        console.log(userID, selectedEvent.eventOrganizerID.toString());
        if (userID !== selectedEvent.eventOrganizerID.toString()) {
            return {
                status: "fail",
                message: "Only Admin Can Update Event Data."
            };
        }

        const deletedEvent = await Event.findByIdAndDelete(eventID);

        return {
            status: "success",
            deletedEvent,
            message: "Event Deleted Successfully."
        };
    } catch (error) {
        return {
            status: "fail",
            message: "Error Happened.",
            error
        };
    }
};

const userJoinEventInDatabase = async (eventID, userID, userData) => {
    try {
        const selectedEvent = await Event.findById(eventID);
        const user = await User.findById(userID);

        if (!selectedEvent) {
            return {
                status: "fail",
                message: "Event Not Found with This ID."
            };
        }

        if (!user) {
            return {
                status: "fail",
                message: "User Not Found with This ID."
            };
        }

        const isUserJoinedEvent = user.eventsJoined.find((id) => eventID.toString() === id.toString());
        const isEventHaveUser = selectedEvent.usersJoined.find((id) => userID.toString() === id.toString());

        if (isUserJoinedEvent || isEventHaveUser) {
            return {
                status: "fail",
                message: "User Already Signed in This Event"
            };
        }

        selectedEvent.usersJoined.push(userID);
        await selectedEvent.save();

        user.eventsJoined.push(eventID);
        await user.save();

        return {
            status: "success",
            message: "Users Joined Successfully."
        };
    } catch (error) {
        return {
            status: "fail",
            message: "Error Happened.",
            error
        };
    }
};

const userLeaveEventInDatabase = async (eventID, userID, userData) => {
    try {
        const selectedEvent = await Event.findById(eventID);
        const user = await User.findById(userID);

        if (!selectedEvent) {
            return {
                status: "fail",
                message: "Event Not Found with This ID."
            };
        }

        if (!user) {
            return {
                status: "fail",
                message: "User Not Found with This ID."
            };
        }

        const isUserJoinedEvent = user.eventsJoined.find((id) => eventID.toString() === id.toString());
        const isEventHaveUser = selectedEvent.usersJoined.find((id) => userID.toString() === id.toString());

        if (!isUserJoinedEvent || !isEventHaveUser) {
            return {
                status: "fail",
                message: "User Not Join This Event."
            };
        }

        const newUsersJoinedInEvent = selectedEvent.usersJoined.filter((user) => user.toString() !== userID.toString());
        console.log(newUsersJoinedInEvent);
        selectedEvent.usersJoined = newUsersJoinedInEvent;
        await selectedEvent.save();

        const newEventsJoinedInUser = user.eventsJoined.filter((event) => event.toString() !== eventID.toString());
        console.log(newEventsJoinedInUser);
        user.eventsJoined = newEventsJoinedInUser;
        await user.save();

        return {
            status: "success",
            message: "Users Leaved Successfully."
        };
    } catch (error) {
        return {
            status: "fail",
            message: "Error Happened.",
            error
        };
    }
};

module.exports = {
    getAllEventsFromDatabase,
    getSelectedEventFromDatabase,
    createEventInDatabase,
    updateEventInDatabase,
    deleteEventInDatabase,
    userJoinEventInDatabase,
    userLeaveEventInDatabase,
};