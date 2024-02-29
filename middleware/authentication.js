const jwt = require('jsonwebtoken');
require('dotenv').config();
const { UnauthenticatedError } = require('../errors');

async function jwtAuthentication(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const [header, token] = authHeader.split(' ');

        if (!(header && token)) {
            throw new UnauthenticatedError('Authentication Credentials are Required, Bearer and Token');
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
            if (err) {
                throw new UnauthenticatedError('Authentication Credentials are Required, Bearer and Token');
            }

            next();
        });
    } else {
        throw new UnauthenticatedError('Authentication Credentials are Required, Bearer and Token');
    }
};

module.exports = jwtAuthentication;