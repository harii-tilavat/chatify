const { validationHandler, userRegisterValidationSchema, userLoginValidationSchema } = require("../validation");
const AuthService = require("../services/auth.service");
const { Response, Message } = require("../utils/response");

class ConfigController {
    constructor() {
        this.authService = new AuthService();
    }
    static register(app) {
        app.route('/login')
            .post(userLoginValidationSchema, validationHandler, async (req, res, next) => {
                try {
                    const { email, password } = req.body;
                    const data = await this.authService.loginUser(email, password);
                    return Response.success(res, `Login success. Welcome back, ${data.user.username}!`, data);
                } catch (error) {
                    next(error);
                }
            })
        app.route("/register")
            .post(userRegisterValidationSchema, validationHandler, async (req, res, next) => {
                try {
                    await this.authService.registerUser(req.body);
                    return Response.created(res, Message.SIGNUP_SUCCESS);
                } catch (error) {
                    next(error);
                }
            })
    }
}
module.exports = ConfigController;
