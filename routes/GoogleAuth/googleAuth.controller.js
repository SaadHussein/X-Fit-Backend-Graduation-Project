const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../../errors');
const { signWithGoogleAccountInDatabase, completeRegisterInDatabase, logoutAccountWithGoogleFromDatabase } = require('../../models/User/googleUser.model');
const catchAsync = require('../../middleware/catchAsync');
require('dotenv').config();

async function signWithGoogleAccount(profile) {
    try {

        const data = {
            name: profile._json.name,
            email: profile._json.email,
            password: process.env.GOOGLE_PASSWORD
        };

        const response = await signWithGoogleAccountInDatabase(data);

        return response;
    } catch (err) {
        throw new BadRequestError('Error Happened When Try Sign With Google');
    }
}

const completeRegister = catchAsync(async (req, res, next) => {
    const data = req.body;
    const response = await completeRegisterInDatabase(data);

    if (response.message === 'Updated Successfully') {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
});

const logoutAccountWithGoogle = catchAsync(async (req, res, next) => {
    req.logout();
    const id = req.params.id;
    const response = await logoutAccountWithGoogleFromDatabase(id);

    if (response.message === 'User Logged Out.') {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
});

const createUserwhenIntegrateWithFlutter = catchAsync(async (req, res, next) => {
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
});

module.exports = {
    signWithGoogleAccount,
    completeRegister,
    logoutAccountWithGoogle,
    createUserwhenIntegrateWithFlutter
};