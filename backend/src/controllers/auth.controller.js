const { validationHandler, userRegisterValidationSchema, userLoginValidationSchema } = require("../validation");
const AuthService = require("../services/auth.service");
const { Response, Message } = require("../utils/response");
const JwtHelpwer = require("../utils/jwtHelper");
const { authMiddleware } = require("../middlewares/auth.middleware");

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }
    register(app) {
        app.route('/login')
            .post(userLoginValidationSchema, validationHandler, async (req, res, next) => {
                try {
                    const { email, password } = req.body;
                    const { user, token } = await this.authService.loginUser(email, password);
                    JwtHelpwer.setTokenCookie(res, token); // Send cookie to client
                    return Response.success(res, `Login success. Welcome back, ${user.fullName}!`, { user, token });
                } catch (error) {
                    next(error);
                }
            })
        app.route("/register")
            .post(userRegisterValidationSchema, validationHandler, async (req, res, next) => {
                try {
                    const { user, token } = await this.authService.registerUser(req.body);
                    JwtHelpwer.setTokenCookie(res, token); // Send cookie to client
                    return Response.created(res, `Signup success. Welcome back, ${user.fullName}!`, { user, token });
                } catch (error) {
                    next(error);
                }
            })
        app.route("/check-auth")
            .post(authMiddleware, async (req, res, next) => {
                try {
                    return await Response.success(res, "Authenication success.");
                } catch (error) {
                    next(error);
                }
            })
        app.route("/logout")
            .post(async (req, res, next) => {
                try {
                    JwtHelpwer.clearCookie(res);
                    return await Response.success(res, "Logout success.");
                } catch (error) {
                    next(error);
                }
            })
    }
}
module.exports = AuthController;
