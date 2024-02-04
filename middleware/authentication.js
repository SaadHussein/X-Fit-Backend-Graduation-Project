const jwt = require('jsonwebtoken');
require('dotenv').config();

async function jwtAuthentication(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const [header, token] = authHeader.split(' ');

        if (!(header && token)) {
            return res.status(401).json({
                message: "Authentication Credentials are Required, Bearer and Token"
            });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
            if (err) {
                return res.status(403).json({
                    message: "Error Happend, Try Again Later."
                });
            }

            next();
        });
    } else {
        return res.status(401).json({
            message: "Authentication Credentials are Required."
        });
    }
};

module.exports = jwtAuthentication;