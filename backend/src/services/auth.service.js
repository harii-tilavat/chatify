
const CryptoUtils = require("../utils/cryptoUtils");
const { AppError } = require("../middlewares/error-handler.midllerware");
const { StatusCode, Message } = require("../utils/response");
const { UserModel } = require("../models/user.model");
const JwtHelpwer = require("../utils/jwtHelper");
const AuthRepo = require("../repositories/auth.repo");
const FileUploader = require("../utils/uploader");
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
            await this.authRepo.register(currentUser);
            return await this.loginUser(user.email, user.password);
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
    async updateProfile(userId, file) {
        try {
            if (!file) throw new AppError(StatusCode.BAD_REQUEST, "File is required!");
            const profileUrl = await FileUploader.uploadStream(file.buffer);
            return new UserModel(await this.authRepo.updateProfile(userId, profileUrl));
        } catch (error) {
            throw error;
        }
    }
}
module.exports = AuthService;

