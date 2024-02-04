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
                    }
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

module.exports = {
    signWithGoogleAccountInDatabase
};