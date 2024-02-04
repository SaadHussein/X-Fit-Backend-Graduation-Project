const { signWithGoogleAccountInDatabase } = require('../../models/User/googleUser.model');
require('dotenv').config();

async function signWithGoogleAccount(profile) {
    const data = {
        name: profile._json.name,
        email: profile._json.email,
        password: process.env.GOOGLE_PASSWORD
    };

    const response = await signWithGoogleAccountInDatabase(data);

    return response;
}

module.exports = {
    signWithGoogleAccount,
};