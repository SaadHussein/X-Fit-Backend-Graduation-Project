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

async function addMemberToCircleInDatabase(IDs) {
    try {
        const user = await userDatabase.findById(IDs.memberID);
        const circle = await circleDatabase.findById(IDs.circleID);

        circle.members.push({
            memberName: user.name,
            memberID: IDs.memberID
        });

        await circle.save();

        return {
            message: "Added Successfully."
        };

    } catch (err) {
        return {
            message: "Error Happened."
        };
    }
}

module.exports = {
    createCircleInDatabase,
    addMemberToCircleInDatabase
};