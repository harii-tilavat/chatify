const { validationResult } = require("express-validator");
const { userLoginValidationSchema, userRegisterValidationSchema } = require("./auth.validation");
const { AppError } = require("../middlewares/error-handler.midllerware");
const { StatusCode } = require("../utils/response");


const validationHandler = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return badRequestResponse(res, "Validation failed: Missing or invalid parameters.", errors.array().map(error => `${error.msg}`));
            throw new AppError(StatusCode.BAD_REQUEST, "Validation failed: Missing or invalid parameters.", errors.array().map(error => `${error.msg}`));
        }
        return next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    validationHandler,
    userLoginValidationSchema,
    userRegisterValidationSchema
}