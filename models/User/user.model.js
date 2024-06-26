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
    try {
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

            const token = jwt.sign({ userID: newUser._id.toString(), name: newUser.name, Date: Date.now() }, process.env.JWT_SECRET_KEY);

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
    } catch (err) {
        return {
            message: "Error Happened.",
            error: err,
            status: false
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
    try {
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

            // return {
            //     name: isUserFound.name,
            //     id: isUserFound._id.toString(),
            //     email: isUserFound.email,
            //     token: isUserFound.authentication.token,
            //     signedWith: isUserFound.signedWith
            // };
            return isUserFound;
        }
    } catch (err) {
        return {
            message: "Error Happened.",
            error: err,
            status: false
        };
    }
}

async function logoutUserFromApp(userId) {
    try {
        const loggedUser = await usersDatabase.findById(userId);

        loggedUser.authentication.token = '';
        await loggedUser.save();

        return {
            message: "loggedOut"
        };
    } catch (err) {
        return {
            message: 'Error Happened.',
            error: err,
            status: false
        };
    }
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

async function createUserInDatabase(userData, req) {
    try {
        if (userData.email === "" || userData.password === "" || userData.name === "" || !userData.email || !userData.password || !userData.name) {
            return {
                status: false,
                message: "Fields Required."
            };
        }

        const isUserFound = await usersDatabase.findOne({ email: userData.email });

        console.log(isUserFound);

        if (isUserFound) {
            return {
                message: "Email Already Exist.",
                status: false
            };
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const token = jwt.sign({ name: userData.name, email: userData.email }, process.env.JWT_SECRET_KEY);

        const newUser = new usersDatabase({
            name: userData.name,
            email: userData.email,
            authentication: {
                password: hashedPassword,
                token: token
            },
            signedWith: 'Email'
        });

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
            userData: newUser,
            message: "Register Successfully, We send Mail to your Email to verify your Account.",
            status: true
        };
    } catch (err) {
        return {
            message: "Error Happened.",
            error: err,
            status: false
        };
    }
}

async function completeUserDataInDatabase(profileData) {
    try {
        if (!profileData.email || profileData.email === '' || profileData.id === '' || !profileData.id || !profileData.age || !profileData.gender || profileData.gender === '' || !profileData.weight || !profileData.height || !profileData.goal || profileData.goal === '' || !profileData.experience || profileData.experience === '' || !profileData.bodyFatPercentage || !profileData.muscleMass || !profileData.workoutDurationPreference || profileData.workoutDurationPreference === '' || !profileData.workoutFrequencyPreference || profileData.workoutFrequencyPreference === '' || !profileData.preferredExerciseTypes || profileData.preferredExerciseTypes === '' || !profileData.trainingEnvironmentPreference || profileData.trainingEnvironmentPreference === '' || !profileData.accessToEquipment || profileData.accessToEquipment === '' || !profileData.motivationLevel || profileData.motivationLevel === '' || !profileData.stressLevels) {
            return {
                status: false,
                message: "Some Fields Required.!"
            };
        } else {
            const isUserFound = await usersDatabase.findById(profileData.id);

            if (!isUserFound) {
                return {
                    message: "User Not Found, Register First.",
                    status: false
                };
            }

            const updatedUser = await usersDatabase.findByIdAndUpdate(profileData.id,
                {
                    age: profileData.age,
                    gender: profileData.gender,
                    weight: profileData.weight,
                    height: profileData.height,
                    goal: profileData.goal,
                    experience: profileData.experience,
                    bodyFatPercentage: profileData.bodyFatPercentage,
                    muscleMass: profileData.muscleMass,
                    workoutDurationPreference: profileData.workoutDurationPreference,
                    workoutFrequencyPreference: profileData.workoutFrequencyPreference,
                    preferredExerciseTypes: profileData.preferredExerciseTypes,
                    trainingEnvironmentPreference: profileData.trainingEnvironmentPreference,
                    accessToEquipment: profileData.accessToEquipment,
                    motivationLevel: profileData.motivationLevel,
                    stressLevels: profileData.stressLevels,
                },
                { new: true });

            return {
                message: "User Updated Successfully.",
                status: true,
                userData: {
                    age: updatedUser.age,
                    gender: updatedUser.gender,
                    weight: updatedUser.weight,
                    height: updatedUser.height,
                    token: updatedUser.authentication.token,
                    goal: updatedUser.goal,
                    experience: updatedUser.experience,
                    bodyFatPercentage: updatedUser.bodyFatPercentage,
                    muscleMass: updatedUser.muscleMass,
                    workoutDurationPreference: updatedUser.workoutDurationPreference,
                    workoutFrequencyPreference: updatedUser.workoutFrequencyPreference,
                    preferredExerciseTypes: updatedUser.preferredExerciseTypes,
                    trainingEnvironmentPreference: updatedUser.trainingEnvironmentPreference,
                    accessToEquipment: updatedUser.accessToEquipment,
                    motivationLevel: updatedUser.motivationLevel,
                    stressLevels: updatedUser.stressLevels
                }
            };
        }
    } catch (err) {
        return {
            message: "Error Happened.",
            status: false,
            error: err
        };
    }
}

async function getUserEventsFromDatabase(userID) {
    try {
        const selectedUser = await usersDatabase.findById(userID).populate('eventsJoined');

        if (!selectedUser) {
            return {
                status: "fail",
                message: "User Not Found with This ID"
            };
        }

        return {
            status: "success",
            user: selectedUser
        };
    } catch (error) {
        return {
            status: "fail",
            error,
            message: "Error Happened."
        };
    }
}

async function updateUserAssessmentInDatabase(userID, updatedData) {
    try {
        const selectedUser = await usersDatabase.findById(userID);

        if (!selectedUser) {
            return {
                status: "fail",
                message: "User Not Found with This ID"
            };
        }

        console.log(updatedData);

        const updatedUser = usersDatabase.findByIdAndUpdate(userID, updatedData);

        return updatedUser;
    } catch (error) {
        return {
            status: "fail",
            error,
            message: "Error Happened."
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
    checkEmailFound,
    createUserInDatabase,
    completeUserDataInDatabase,
    getUserEventsFromDatabase,
    updateUserAssessmentInDatabase
};