const usersDatabase = require('./user.mongo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function getUserFromDatabase(userID) {
    try {
        const userData = await usersDatabase.findById(userID);
        if (!userData) {
            throw new Error('failed');
        } else {
            return {
                message: 'success',
                userData
            };
        }
    } catch (err) {
        return {
            message: 'failed'
        };
    }
}

async function addUserToDatabase(userData) {
    if (!userData.name || !userData.age || !userData.email || !userData.gender || !userData.weight || !userData.height || !userData.goal || !userData.experience) {
        return {
            success: false
        };
    } else {
        try {
            const userFound = await usersDatabase.findOne({ email: userData.email });

            console.log(userFound);
            if (userFound) {
                return {
                    success: false,
                    message: "found"
                };
            }

            const data = await usersDatabase.create(userData);
            if (!data) {
                throw new Error('failed');
            }
            return {
                success: true,
                data
            };
        } catch (err) {
            return {
                success: false
            };
        }
    }
}

async function registerUserToDatabase(userData) {
    if (!userData.name || !userData.age || !userData.email || !userData.gender || !userData.weight || !userData.height || !userData.goal || !userData.experience || !userData.authentication.password || !userData.bodyFatPercentage || !userData.muscleMass || !userData.workoutDurationPreference || !userData.workoutFrequencyPreference || !userData.preferredExerciseTypes || !userData.trainingEnvironmentPreference || !userData.accessToEquipment || !userData.motivationLevel || !userData.stressLevels) {
        return {
            success: false,
            message: "Some Fields Required.!"
        };
    } else {
        const isUserFound = await usersDatabase.findOne({ email: userData.email });
        if (isUserFound) {
            return {
                success: false,
                message: "found"
            };
        }

        const hashedPassword = await bcrypt.hash(userData.authentication.password, 12);

        const updatedUser = {
            ...userData, authentication: {
                password: hashedPassword,
                token: ""
            }
        };

        const newUser = new usersDatabase(updatedUser);

        const token = jwt.sign({ userID: newUser._id.toString(), name: newUser.name }, process.env.JWT_SECRET_KEY);

        newUser.authentication.token = token;

        await newUser.save();

        return {
            name: newUser.name,
            id: newUser._id.toString(),
            email: newUser.email,
            token: newUser.authentication.token
        };
    }
}

async function loginUserToDatabase(userData) {
    if (!userData.email || !userData.password) {
        return {
            success: false,
            message: "Fields Required.!"
        };
    } else {
        const isUserFound = await usersDatabase.findOne({ email: userData.email });

        if (!isUserFound) {
            return {
                success: false,
                message: "not found"
            };
        }

        const isPasswordMatch = await bcrypt.compare(userData.password, isUserFound.authentication.password);

        if (!isPasswordMatch) {
            return {
                success: false,
                message: "wrong password"
            };
        }

        const token = jwt.sign({ userID: isUserFound._id.toString(), name: isUserFound.name, date: new Date().toString() }, process.env.JWT_SECRET_KEY);

        isUserFound.authentication.token = token;
        await isUserFound.save();

        return {
            name: isUserFound.name,
            id: isUserFound._id.toString(),
            email: isUserFound.email,
            token: isUserFound.authentication.token
        };
    }
}

async function logoutUserFromApp(userId) {
    const loggedUser = await usersDatabase.findById(userId);

    loggedUser.authentication.token = '';
    await loggedUser.save();

    return {
        message: "loggedOut"
    };
}

module.exports = {
    addUserToDatabase,
    getUserFromDatabase,
    registerUserToDatabase,
    loginUserToDatabase,
    logoutUserFromApp
};