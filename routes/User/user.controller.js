const { addUserToDatabase, getUserFromDatabase, registerUserToDatabase, loginUserToDatabase, logoutUserFromApp, verifyEmailInDatabase, resetPasswordInDatabase, checkEmailFound } = require('../../models/User/user.model');
const { generateToken, getTransport, getMailOptionsForForgetPassword } = require("../../helpers/emailService");


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

async function addUser(req, res) {
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
}

async function registerUser(req, res) {
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
    } else {
        return res.status(200).json({
            message: "Register Success, Please Verify Your Account From The Mail We Send To Your Email.",
            user: response
        });
    }
}

async function verifyEmail(req, res) {
    const token = req.params.token;
    const response = await verifyEmailInDatabase(token);

    if (response.message === 'Email Verified Successfully.') {
        return res.status(200).json(response);
    } else {
        return res.status(400).json(response);
    }
}

async function loginUser(req, res) {
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
    } else {
        return res.status(200).json({
            message: "Login Success.",
            user: response
        });
    }
}

async function logoutUser(req, res) {
    const id = req.body.id;
    console.log(req.body);
    const response = await logoutUserFromApp(id);

    if (response.message === 'loggedOut') {
        console.log('Success ?');
        return res.status(200).json({
            message: "User LoggedOut Successfully."
        });
    } else {
        return res.status(400).json({
            message: "User LoggedOut Failed."
        });
    }
}

async function forgetPassword(req, res) {
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
}

async function resetPassword(req, res) {
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
}

module.exports = {
    HelloUser,
    addUser,
    getUser,
    registerUser,
    loginUser,
    logoutUser,
    verifyEmail,
    forgetPassword,
    resetPassword
};