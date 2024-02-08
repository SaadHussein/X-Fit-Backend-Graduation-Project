const usersDatabase = require('./user.mongo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function signWithGoogleAccountInDatabase(profileData) {
    if (!profileData.name || !profileData.email || !profileData.password || profileData.email === '' || profileData.name === '' || profileData.password === '') {
        return {
            message: "Fields Required."
        };
    } else {
        try {
            const userFound = await usersDatabase.findOne({ email: profileData.email });

            if (userFound) {
                const token = jwt.sign({ email: profileData.email, name: profileData.name, id: userFound._id }, process.env.JWT_SECRET_KEY);

                userFound.authentication.token = token;

                await userFound.save();

                return {
                    message: "Logged In Successfully",
                    userData: userFound
                };
            } else {
                const hashedPassword = await bcrypt.hash(profileData.password, 12);
                const token = jwt.sign({ email: profileData.email, name: profileData.name }, process.env.JWT_SECRET_KEY);

                const newUser = new usersDatabase({
                    name: profileData.name,
                    email: profileData.email,
                    authentication: {
                        password: hashedPassword,
                        token: token,
                        verified: true,
                    },
                    signedWith: "Google"
                });

                await newUser.save();

                return {
                    message: "User Created Successfully with Google",
                    userData: newUser,
                };
            }
        } catch (err) {
            return {
                message: "Error Happened."
            };
        }
    }
};

async function completeRegisterInDatabase(profileData) {
    if (!profileData.email || profileData.email === '' || profileData.id === '' || !profileData.id || !profileData.age || !profileData.gender || profileData.gender === '' || !profileData.weight || !profileData.height || !profileData.goal || profileData.goal === '' || !profileData.experience || profileData.experience === '' || !profileData.bodyFatPercentage || !profileData.muscleMass || !profileData.workoutDurationPreference || profileData.workoutDurationPreference === '' || !profileData.workoutFrequencyPreference || profileData.workoutFrequencyPreference === '' || !profileData.preferredExerciseTypes || profileData.preferredExerciseTypes === '' || !profileData.trainingEnvironmentPreference || profileData.trainingEnvironmentPreference === '' || !profileData.accessToEquipment || profileData.accessToEquipment === '' || !profileData.motivationLevel || profileData.motivationLevel === '' || !profileData.stressLevels) {
        console.log('Error');
        return {
            success: false,
            message: "Some Fields Required.!"
        };
    } else {
        try {
            const registeredUser = await usersDatabase.findOneAndUpdate({ _id: profileData.id }, {
                $set: {
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
                    stressLevels: profileData.stressLevels
                }
            }, { new: true });

            return {
                message: 'Updated Successfully',
                updatedUser: registeredUser
            };
        } catch (err) {
            return {
                message: "Error Happened."
            };
        }
    }
}

async function logoutAccountWithGoogleFromDatabase(UserID) {
    if (!UserID) {
        return {
            messgae: "ID Required."
        };
    } else {
        try {
            const User = await usersDatabase.findById(UserID);

            if (!User) {
                return {
                    message: "User Not Found."
                };
            }

            User.authentication.token = '';
            await User.save();
            return {
                message: "User Logged Out."
            };
        } catch (err) {
            return {
                message: "Error Happened."
            };
        }
    }
}

module.exports = {
    signWithGoogleAccountInDatabase,
    completeRegisterInDatabase,
    logoutAccountWithGoogleFromDatabase
};