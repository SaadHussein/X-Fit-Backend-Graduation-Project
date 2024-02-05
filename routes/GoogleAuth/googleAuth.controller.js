const { signWithGoogleAccountInDatabase, completeRegisterInDatabase } = require('../../models/User/googleUser.model');
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

async function completeRegister(req, res) {
    const data = req.body;
    const response = await completeRegisterInDatabase(data);

    if (response.message === 'Updated Successfully') {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
}

module.exports = {
    signWithGoogleAccount,
    completeRegister
};