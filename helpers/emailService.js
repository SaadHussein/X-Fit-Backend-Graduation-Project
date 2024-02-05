const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require('dotenv').config();

function getTransport() {
    return nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

function generateToken(email) {
    return jwt.sign({ email }, process.env.JWT_SECRET_KEY);
};

function getMailOptions(email, link) {
    let body = `
    <h2>Hey ${email}</h2>
    <p>Here's The Link you Requested to Verify your Account: </p>
    <p>${link}</p>
    <p>Welcome to X-Fit</p>`;

    return {
        body,
        subject: "Verify Your Email on X-Fit",
        to: email,
        html: body,
        from: process.env.EMAIL_ADDRESS,
    };
};

module.exports = {
    getTransport,
    generateToken,
    getMailOptions
};