const jwt = require('jsonwebtoken');
require('dotenv').config();
const { UnauthenticatedError, NotFoundError } = require('../errors');
const User = require('../models/User/user.mongo');
const { promisify } = require('util');

async function jwtAuthentication(req, res, next) {
    // const authHeader = req.headers.authorization || req.cookies.xfit;

    let token;
    if (req.headers.authorization !== undefined && (req.headers.authorization || req.headers.authorization.startsWith('Bearer'))) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.xfit) {
        token = req.cookies.xfit;
    }


    if (!token) {
        throw new UnauthenticatedError('Authentication Credentials are Required...Maybe You Need to Login or Register.');
    }

    console.log(token);
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
    // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log(decoded);

    const currentUser = await User.findById(decoded.userID);

    if (!currentUser) {
        throw new NotFoundError('User Not Found, Register First Please.');
    }

    console.log(currentUser);

    req.user = currentUser;
    console.log(req.user);
    next();

    // if (authHeader) {
    //     const [header, token] = authHeader.split(' ');

    //     if (!(header && token)) {
    //         throw new UnauthenticatedError('Authentication Credentials are Required, Bearer and Token...Maybe You Need to Login or Register.');
    //     }

    //     jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
    //         if (err) {
    //             throw new UnauthenticatedError('Invalid Token');
    //         }

    //         const user = await User.findById(data.userID).select('-authentication');
    //         if (!user) {
    //             throw new NotFoundError('User Not Found, Register First Please.');
    //         }

    //         req.user = user;
    //         next();
    //     });
    // } else {
    //     throw new UnauthenticatedError('Authentication Credentials are Required, Bearer and Token...Maybe You Need to Login or Register.');
    // }
};

module.exports = jwtAuthentication;