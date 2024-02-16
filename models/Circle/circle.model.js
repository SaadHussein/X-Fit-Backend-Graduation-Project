const circleDatabase = require('./circle.mongo');
const userDatabase = require('../User/user.mongo');

async function createCircleInDatabase(circleData) {
    try {
        const userId = await userDatabase.findById(circleData.adminID);

        if (!userId) {
            return {
                message: "UserID Not Correct."
            };
        }

        const newCircle = new circleDatabase(circleData);
        console.log(newCircle);

        const member = {
            memberName: userId.name,
            memberID: circleData.adminID
        };

        newCircle.members.push(member);

        await newCircle.save();

        return {
            message: "Created Successfully.",
            data: {
                id: newCircle._id.toString(),
                ...circleData,
                members: newCircle.members
            }
        };

    } catch (err) {
        return {
            message: "Error Happened."
        };
    }
}

async function removeCircleFromDatabase(circleID) {
    try {
        await circleDatabase.deleteOne({ _id: circleID });

        return {
            message: "Deleted Successfully."
        };
    } catch (err) {
        return {
            message: "Error Happened."
        };
    }
}

async function addMemberToCircleInDatabase(IDs) {
    try {
        const user = await userDatabase.findById(IDs.memberID);
        const circle = await circleDatabase.findById(IDs.circleID);

        if (!circle || !user) {
            return {
                message: "UserID or CircleID Not Correct."
            };
        }

        circle.members.push({
            memberName: user.name,
            memberID: IDs.memberID
        });

        await circle.save();

        return {
            message: "Added Successfully.",
            circleData: circle
        };

    } catch (err) {
        return {
            message: "Error Happened."
        };
    }
}

async function removeMemberFromCircle(IDs) {
    try {
        const circle = await circleDatabase.findById(IDs.circleID);

        if (!circle) {
            return {
                message: "Wrong in IDs"
            };
        }

        if (circle.adminID !== IDs.adminID) {
            return {
                message: "Sorry, Admin only Can Do This."
            };
        }

        const updatedMembers = circle.members.filter((member) => member.memberID !== IDs.memberID);
        circle.members = [...updatedMembers];

        await circle.save();

        return {
            message: "Member Deleted Successfully.",
            circleData: circle
        };
    } catch (err) {
        return {
            message: "Error Happened."
        };
    }
}

async function memberLeaveFromCircle(IDs) {
    try {
        const circle = await circleDatabase.findById(IDs.circleID);

        if (!circle) {
            return {
                message: "Error in CircleID"
            };
        }

        const user = circle.members.find((member) => member.memberID === IDs.memberID);

        if (!user) {
            return {
                message: "User Not Found in This Circle"
            };
        }

        const updatedMembers = circle.members.filter((member) => member.memberID !== IDs.memberID);
        circle.members = [...updatedMembers];

        await circle.save();

        return {
            message: "Member Leaved Successfully.",
            circleData: circle
        };
    } catch (err) {
        return {
            message: "Error Happened."
        };
    }
}

async function editCircleDataInDatabase(updatedData) {
    try {
        const ourCircle = await circleDatabase.findById(updatedData.circleID);

        if (!ourCircle) {
            return {
                messgae: "Error in CircleID"
            };
        }

        if (updatedData.userID !== ourCircle.adminID) {
            return {
                message: "Only Admin Can Do This"
            };
        }

        const circle = await circleDatabase.findByIdAndUpdate(updatedData.circleID, {
            $set: {
                name: updatedData.name,
                description: updatedData.description || ""
            }
        }, { new: true });

        return {
            message: "Circle Updated Successfully.",
            circleData: circle
        };
    } catch (err) {
        return {
            message: "Error Happened."
        };
    }
}

async function getCircleById(circleID) {
    try {
        const circle = await circleDatabase.findById(circleID);

        if (!circle) {
            return {
                message: "Circle Not Found."
            };
        }

        return {
            message: "Circle Found.",
            circleData: circle
        };

    } catch (err) {
        return {
            message: "Error Happened."
        };
    }
}

module.exports = {
    createCircleInDatabase,
    removeCircleFromDatabase,
    addMemberToCircleInDatabase,
    getCircleById,
    removeMemberFromCircle,
    editCircleDataInDatabase,
    memberLeaveFromCircle
};