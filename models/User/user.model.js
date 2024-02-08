const usersDatabase = require('./user.mongo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateToken, getMailOptions, getTransport } = require("../../helpers/emailService");
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

async function registerUserToDatabase(userData, req) {
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
                token: "",
                verified: false
            },
            signedWith: 'Email'
        };

        const newUser = new usersDatabase(updatedUser);

        const token = jwt.sign({ userID: newUser._id.toString(), name: newUser.name }, process.env.JWT_SECRET_KEY);

        newUser.authentication.token = token;

        await newUser.save();

        const tokenForVerify = generateToken(userData.email);
        const link = `${req.protocol}://${req.get('host')}/api/v1/user/verifyEmail/${tokenForVerify}`;
        console.log(link);
        let mailRequest = getMailOptions(userData.email, link);

        let mailCreated = "";
        getTransport().sendMail(mailRequest, (error) => {
            if (error) {
                return {
                    message: 'Error When Trying To Send Email To User.'
                };
            } else {
                mailCreated = 'Mail Sent To The User';
            }
        });

        return {
            name: newUser.name,
            id: newUser._id.toString(),
            email: newUser.email,
            token: newUser.authentication.token,
            signedWith: newUser.signedWith
        };
    }
}

async function verifyEmailInDatabase(token) {
    if (!token) {
        return {
            message: "Token Required."
        };
    } else {
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch {
            return {
                message: "Invalid Authentication Credentials"
            };
        }

        if (!decodedToken.hasOwnProperty("email")) {
            return {
                message: "Invalid Authentication Credentials."
            };
        }

        const { email } = decodedToken;
        try {
            const userInDatabase = await usersDatabase.findOne({ email: email });
            userInDatabase.authentication.verified = true;
            await userInDatabase.save();

            return {
                message: "Email Verified Successfully."
            };
        } catch (err) {
            return {
                message: "Error Happened."
            };
        }
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
            token: isUserFound.authentication.token,
            signedWith: isUserFound.signedWith
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

async function checkEmailFound(email) {
    try {
        if (!email || email === '') {
            return {
                message: "Please Send Email"
            };
        } else {
            const User = await usersDatabase.findOne({ email: email });

            if (!User) {
                return {
                    message: "User Not Found"
                };
            }

            return {
                message: "User Found."
            };
        }
    } catch (err) {
        return {
            message: "Error Happened."
        };
    }
}

async function resetPasswordInDatabase(PasswordData, token) {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decodedToken.hasOwnProperty("email")) {
            return {
                message: "Invalid Authentication Credentials."
            };
        }

        const { email } = decodedToken;

        const newHashedPassword = await bcrypt.hash(PasswordData.newPassword, 12);

        const userInDatabase = await usersDatabase.findOne({ email: email });
        userInDatabase.authentication.password = newHashedPassword;
        await userInDatabase.save();

        return {
            message: "Password Changed Successfully."
        };
    } catch (err) {
        return {
            message: "Error Happened When Trying to Change Password."
        };
    }
}

module.exports = {
    addUserToDatabase,
    getUserFromDatabase,
    registerUserToDatabase,
    loginUserToDatabase,
    logoutUserFromApp,
    verifyEmailInDatabase,
    resetPasswordInDatabase,
    checkEmailFound
};