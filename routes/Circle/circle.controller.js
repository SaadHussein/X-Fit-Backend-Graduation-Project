const { createCircleInDatabase, addMemberToCircleInDatabase, getCircleById, removeCircleFromDatabase, removeMemberFromCircle, memberLeaveFromCircle, editCircleDataInDatabase } = require('../../models/Circle/circle.model');
const catchAsync = require('../../middleware/catchAsync');

const createCircle = catchAsync(async (req, res, next) => {
    const data = req.body;

    if (data.name === '' || !data.name || data.adminID === '' || !data.adminID) {
        return res.status(404).json({
            message: "Fields Required."
        });
    }

    const result = await createCircleInDatabase(data);

    if (result.message === 'Created Successfully.') {
        return res.status(201).json(result);
    } else {
        return res.status(404).json(result);
    }

});

const addMemberToCircle = catchAsync(async (req, res, next) => {
    const data = req.body;

    if (!data.memberID || data.memberID === "" || !data.circleID || data.circleID === "") {
        return res.status(400).json({
            message: "Fields Required."
        });
    }

    const result = await addMemberToCircleInDatabase(data);

    if (result.message === 'Added Successfully.') {
        return res.status(200).json(result);
    } else {
        return res.status(404).json(result);
    }
});

const getCircle = catchAsync(async (req, res, next) => {
    const data = req.body;

    if (data.id === "" || !data.id) {
        return res.status(404).json({
            message: "ID Required."
        });
    }

    const result = await getCircleById(data.id);

    if (result.message === "Circle Found.") {
        return res.status(200).json(result);
    } else {
        return res.status(404).json(result);
    }
});

const deleteCircle = catchAsync(async (req, res, next) => {
    const data = req.body;

    if (data.circleID === "" || !data.circleID || data.adminID === "" || !data.adminID) {
        return res.status(404).json({
            message: "IDs Required."
        });
    }

    const result = await removeCircleFromDatabase(data);

    if (result.message === "Deleted Successfully.") {
        return res.status(200).json(result);
    } else {
        return res.status(400).json(result);
    }
});

const removeMember = catchAsync(async (req, res, next) => {
    const data = req.body;

    if (data.adminID === "" || data.memberID === "" || data.circleID === "" || !data.memberID || !data.circleID || !data.adminID) {
        return res.status(404).json({
            message: "Fields Required."
        });
    }

    const result = await removeMemberFromCircle(data);

    if (result.message === 'Member Deleted Successfully.') {
        return res.status(200).json(result);
    } else {
        return res.status(400).json(result);
    }
});

const memberLeave = catchAsync(async (req, res, next) => {
    const data = req.body;

    if (data.memberID === "" || data.circleID === "" || !data.memberID || !data.circleID) {
        return res.status(404).json({
            message: "Fields Required."
        });
    }

    const result = await memberLeaveFromCircle(data);

    if (result.message === 'Member Leaved Successfully.') {
        return res.status(200).json(result);
    } else {
        return res.status(400).json(result);
    }
});

const updateCircle = catchAsync(async (req, res, next) => {
    const data = req.body;

    if (!data.name || data.name === "" || data.circleID === "" || !data.circleID || data.userID === "" || !data.userID) {
        return res.status(404).json({
            message: "Fields Required."
        });
    }

    const result = await editCircleDataInDatabase(data);

    if (result.message === "Circle Updated Successfully.") {
        return res.status(200).json(result);
    } else {
        return res.status(400).json(result);
    }
});

module.exports = {
    createCircle,
    deleteCircle,
    addMemberToCircle,
    getCircle,
    removeMember,
    memberLeave,
    updateCircle
};