const JwtHelpwer = require("../utils/jwtHelper");
const { StatusCode, Message } = require("../utils/response");
const { AppError } = require("./error-handler.midllerware");

const authMiddleware = (req, res, next) => {
    try {
        const { authToken } = req.cookies;
        if (!authToken) {
            throw new AppError(StatusCode.UNAUTHORIZED, Message.SESSION_EXPIRED);
        }
        // if (!authorization || !authorization.startsWith('Bearer ')) {
        //     throw new AppError(StatusCode.UNAUTHORIZED, Message.TOKEN_MISSING);
        // }
        // const token = authorization.split(' ')[1];
        const decoded = JwtHelpwer.verifyToken(authToken);
        req.user = { userId: decoded.data.id, email: decoded.data.email };
        return next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new AppError(StatusCode.UNAUTHORIZED, Message.INVALID_TOKEN);
        } else if (error.name === 'TokenExpiredError') {
            throw new AppError(StatusCode.UNAUTHORIZED, Message.TOKEN_EXPIRED);
        } else {
            throw error;
        }
    }
}
module.exports = { authMiddleware }