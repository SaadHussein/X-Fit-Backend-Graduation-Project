const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../../errors');
const { signWithGoogleAccountInDatabase, completeRegisterInDatabase, logoutAccountWithGoogleFromDatabase } = require('../../models/User/googleUser.model');
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

async function createUserwhenIntegrateWithFlutter(req, res) {
    const { body: { email, name } } = req;

    if (!email || !name) {
        throw new BadRequestError('Email and Name Must Be Provided');
    }

    const response = await signWithGoogleAccountInDatabase({ email, name, password: process.env.GOOGLE_PASSWORD });

    if (response.message === "Logged In Successfully" || response.message === "User Created Successfully with Google, Please Complete Another Data.") {
        return res.status(StatusCodes.OK).json({ response });
    } else {
        throw new BadRequestError('Error Happened When Trying To Do it With Google.');
    }
}

module.exports = {
    signWithGoogleAccount,
    completeRegister,
    logoutAccountWithGoogle,
    createUserwhenIntegrateWithFlutter
};