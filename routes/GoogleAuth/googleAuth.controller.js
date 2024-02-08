const { signWithGoogleAccountInDatabase, completeRegisterInDatabase, logoutAccountWithGoogleFromDatabase } = require('../../models/User/googleUser.model');
require('dotenv').config();

async function signWithGoogleAccount(profile) {
    const data = {
        name: profile._json.name,
        email: profile._json.email,
        password: process.env.GOOGLE_PASSWORD
    };

    const response = await signWithGoogleAccountInDatabase(data);
    console.log(response);

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

async function logoutAccountWithGoogle(req, res) {
    req.logout();
    const id = req.params.id;
    const response = await logoutAccountWithGoogleFromDatabase(id);

    if (response.message === 'User Logged Out.') {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
}

module.exports = {
    signWithGoogleAccount,
    completeRegister,
    logoutAccountWithGoogle
};