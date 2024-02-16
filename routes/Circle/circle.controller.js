const { createCircleInDatabase, addMemberToCircleInDatabase, getCircleById, removeCircleFromDatabase, removeMemberFromCircle, memberLeaveFromCircle, editCircleDataInDatabase } = require('../../models/Circle/circle.model');

async function createCircle(req, res) {
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

}

async function addMemberToCircle(req, res) {
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
}

async function getCircle(req, res) {
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
}

async function deleteCircle(req, res) {
    const data = req.body;

    if (data.id === "" || !data.id) {
        return res.status(404).json({
            message: "ID Required."
        });
    }

    const result = await removeCircleFromDatabase(data.id);

    if (result.message === "Deleted Successfully.") {
        return res.status(200).json(result);
    } else {
        return res.status(400).json(result);
    }
}

async function removeMember(req, res) {
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
}

async function memberLeave(req, res) {
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
}

async function updateCircle(req, res) {
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
}

module.exports = {
    createCircle,
    deleteCircle,
    addMemberToCircle,
    getCircle,
    removeMember,
    memberLeave,
    updateCircle
};