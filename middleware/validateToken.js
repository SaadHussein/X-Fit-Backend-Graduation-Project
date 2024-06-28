require('dotenv').config();
const jwt = require("jsonwebtoken");

function validateToken(token) {
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decode;
    } catch (e) {
        return false;
    }
}

module.exports = validateToken;