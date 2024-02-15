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
        await newCircle.save();

        return {
            message: "Created Successfully.",
            data: {
                ...circleData,
                id: newCircle._id.toString()
            }
        };

    } catch (err) {
        return {
            message: "Error Happened."
        };
    }
}

module.exports = {
    createCircleInDatabase,
};