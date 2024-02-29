const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        message: err.message || "Something Went Wrong, Try Again Later.",
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    };

    if (err.name === 'ValidationError') {
        customError.message = Object.values(err.errors).map((item) => item.message).join(', ');
        customError.statusCode = 400;
    }

    if (err.code && err.code === 11000) {
        customError.message = `Duplicated Value Entered For ${Object.keys(err.keyValue)} Field, Please Enter Another Value.`;
        customError.statusCode = 400;
    }

    if (err.name === 'CastError') {
        customError.message = `No Item Found With ID: ${err.value}`;
        customError.statusCode = 404;
    }

    return res.status(customError.statusCode).json({ message: customError.message });
};

module.exports = errorHandlerMiddleware;