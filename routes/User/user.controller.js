const { addUserToDatabase, getUserFromDatabase, registerUserToDatabase, loginUserToDatabase, logoutUserFromApp, verifyEmailInDatabase, resetPasswordInDatabase, checkEmailFound, createUserInDatabase, completeUserDataInDatabase, getUserEventsFromDatabase } = require('../../models/User/user.model');
const { generateToken, getTransport, getMailOptionsForForgetPassword } = require("../../helpers/emailService");
const catchAsync = require('../../middleware/catchAsync');


function HelloUser(req, res) {
    return res.json({
        message: "Hello User."
    });
}

async function getUser(req, res) {
    const id = req.body.id;
    const userData = await getUserFromDatabase(id);

    if (userData.message === 'failed') {
        res.status(400).json({
            message: "Got User Failed..!",
        });
    } else {
        res.status(200).json({
            message: "Got User Successfully",
            data: userData.userData
        });
    }

}

async function addUser(req, res, next) {
    const userData = req.body;
    const addData = await addUserToDatabase(userData);
    console.log(addData);

    if (addData.success === true) {
        res.status(201).json({
            message: "User Added Successfully",
            data: addData.data,
        });
    } else if (addData.message === 'found' && addData.success === false) {
        res.json({
            message: "User Already Found."
        });
    } else {
        res.status(400).json({
            message: "Add User Failed..!"
        });
    }
};

const registerUser = catchAsync(async (req, res, next) => {
    const userData = req.body;
    const response = await registerUserToDatabase(userData, req);
    if (response.success === false && response.message === "Some Fields Required.!") {
        return res.status(400).json({
            message: "Fields Required..!"
        });
    } else if (response.success === false && response.message === "found") {
        return res.status(400).json({
            message: "User Already Exist..!"
        });
    } else if (response.message === 'Error When Trying To Send Email To User.') {
        return res.status(400).json(response);
    } else if (response.message === 'Error Happened.' && response.status === false) {
        return res.status(404).json({
            message: "Register Failed Try Again Later."
        });
    } else {
        res.cookie('xfit', response.token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        });
        return res.status(200).json({
            message: "Register Success, Please Verify Your Account From The Mail We Send To Your Email.",
            user: response
        });
    }
});

const verifyEmail = catchAsync(async (req, res, next) => {
    const token = req.params.token;
    const response = await verifyEmailInDatabase(token);

    if (response.message === 'Email Verified Successfully.') {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
});

const loginUser = catchAsync(async (req, res, next) => {
    const userData = req.body;
    const response = await loginUserToDatabase(userData);
    if (response.success === false && response.message === "Fields Required.!") {
        return res.status(400).json({
            message: "Fields Required..!"
        });
    } else if (response.success === false && response.message === "not found") {
        return res.status(400).json({
            message: "User Not Found...Please Register First."
        });
    } else if (response.message === 'Error Happened.' && response.status === false) {
        return res.status(400).json(response);
    } else if (response.message === "wrong password" && response.success === false) {
        return res.status(400).json(response);
    } else {
        res.cookie('xfit', response.token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        });
        return res.status(200).json({
            message: "Login Success.",
            user: response
        });
    }
});

const logoutUser = catchAsync(async (req, res, next) => {
    const id = req.body.id;
    const response = await logoutUserFromApp(id);

    if (response.message === 'loggedOut') {
        return res.status(200).json({
            message: "User LoggedOut Successfully."
        });
    } else if (response.message === 'Error Happened.' && response.status === false) {
        return res.status(400).json(response);
    } else {
        return res.status(400).json({
            message: "User LoggedOut Failed."
        });
    }
});

const forgetPassword = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const response = await checkEmailFound(email);

    if (response.message === 'User Found.') {
        const token = generateToken(email);
        const link = `${req.protocol}://${req.get('host')}/forgetPassword/${token}`;
        let mailRequest = getMailOptionsForForgetPassword(email, link);

        return getTransport().sendMail(mailRequest, (error) => {
            if (error) {
                return res.status(500).json({ message: "Can't send email." });
            } else {
                return res.status(200).json({
                    message: `Link Sent To ${email}`,
                });
            }
        });
    } else {
        return res.status(400).json({
            message: "Email Not Found."
        });
    }
});

const resetPassword = catchAsync(async (req, res, next) => {
    const data = req.body;
    const token = req.params.token;

    if (data.ConfirmNewPassword !== data.newPassword) {
        return res.status(400).json({
            message: "The Password and Confirm Password Do Not Match."
        });
    }

    const response = await resetPasswordInDatabase(data, token);

    console.log(response);

    if (response.message === 'Password Changed Successfully.') {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
});

const createUser = catchAsync(async (req, res, next) => {
    const data = req.body;
    const result = await createUserInDatabase(data, req);

    if (result.message === 'Register Successfully, We send Mail to your Email to verify your Account.' && result.status === true) {
        return res.status(201).json(result);
    } else {
        return res.status(400).json(result);
    }
});

const completeUserData = catchAsync(async (req, res, next) => {
    const data = req.body;
    const result = await completeUserDataInDatabase(data);

    if (result.message === 'User Updated Successfully.' && result.status === true) {
        return res.status(200).json(result);
    } else {
        return res.status(400).json(result);
    }
});

const getUserEvents = catchAsync(async (req, res, next) => {
    const userID = req.user.id;
    const response = await getUserEventsFromDatabase(userID);

    if (response.status === 'success') {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
});

module.exports = {
    HelloUser,
    addUser,
    getUser,
    registerUser,
    loginUser,
    logoutUser,
    verifyEmail,
    forgetPassword,
    resetPassword,
    createUser,
    completeUserData,
    getUserEvents
};