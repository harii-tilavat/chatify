const { Response, } = require("../utils/response");
const JwtHelpwer = require("../utils/jwtHelper");
const AuthService = require("../services/auth.service");

const authService = new AuthService();

class AuthController {
    constructor() {
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user, token } = await authService.loginUser(email, password);
            JwtHelpwer.setTokenCookie(res, token); // Send cookie to client
            return Response.success(res, `Login success. Welcome back, ${user.fullName}!`, { user, token });
        } catch (error) {
            next(error);
        }
    }
    async register(req, res, next) {
        try {
            const { user, token } = await authService.registerUser(req.body);
            JwtHelpwer.setTokenCookie(res, token); // Send cookie to client
            return Response.created(res, `Signup success. Welcome back, ${user.fullName}!`, { user, token });
        } catch (error) {
            next(error);
        }
    }
    async checkAuth(req, res, next) {
        try {
            const { userId } = req.user;
            return await Response.success(res, "Authenication success.", userId);
        } catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const { userId } = req.user;
            const updatedUser = await authService.updateProfile(userId, req.file);
            return await Response.success(res, "Profile updated successfully.", updatedUser);
        } catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            JwtHelpwer.clearCookie(res);
            return await Response.success(res, "Logout success.");
        } catch (error) {
            next(error);
        }
    }
}
module.exports = AuthController;
