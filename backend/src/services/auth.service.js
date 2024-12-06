
const CryptoUtils = require("../utils/cryptoUtils");
const { AppError } = require("../middlewares/errorHandlerMiddleware");
const { StatusCode, Message } = require("../utils/response");
const { UserModel } = require("../models/userModel");
const JwtHelpwer = require("../utils/jwtHelper");
const AuthRepo = require("../repositories/auth.repo");

class AuthService {
    constructor() {
        // Initialize the repository for handling DB queries.
        this.authRepo = new AuthRepo();
    }
    async registerUser(user) {
        try {
            // Check if the user already exists by email.
            const isExists = await this.authRepo.findUserByEmail(user.email);
            if (isExists) {
                throw new AppError(StatusCode.BAD_REQUEST, Message.EMAIL_ALREADY_EXISTS);
            }
            const hashPassword = await CryptoUtils.hashPassword(user.password);
            const currentUser = { ...user, password: hashPassword };

            // Register the user in the database.
            return await this.authRepo.register(currentUser);
        } catch (error) {
            throw error;
        }
    }
    async loginUser(email, password) {
        try {
            // Find the user by email.
            const currentUser = await this.authRepo.findUserByEmail(email);
            if (!currentUser) {
                throw new AppError(StatusCode.BAD_REQUEST, Message.USER_NOT_FOUND);
            }

            // Compare the provided password with the stored hashed password.
            const isPasswordCorrect = await CryptoUtils.compareHash(password, currentUser.password);
            if (!isPasswordCorrect) {
                throw new AppError(StatusCode.BAD_REQUEST, Message.INVALID_PASSWORD);
            }

            // Generate the JWT token
            const token = JwtHelpwer.generateToken({ id: currentUser.id, email: currentUser.email });
            return {
                token,
                user: new UserModel(currentUser)
            }
        } catch (error) {
            throw error;
        }
    }
}
module.exports = AuthService;