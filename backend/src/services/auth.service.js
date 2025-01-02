
const CryptoUtils = require("../utils/cryptoUtils");
const { AppError } = require("../middlewares/error-handler.midllerware");
const { StatusCode, Message } = require("../utils/response");
const { UserModel } = require("../models/user.model");
const JwtHelpwer = require("../utils/jwtHelper");
const AuthRepo = require("../repositories/auth.repo");
const FileUploader = require("../utils/uploader");
const client = require("../config/google.config");
class AuthService {
    constructor() {
        // Initialize the repository for handling DB queries.
        this.authRepo = new AuthRepo();
    }
    async verifyGoogleLogin(token) {
        // Verify the Google token
        try {
            // Validate token
            if (!token) throw new AppError(StatusCode.UNAUTHORIZED, Message.TOKEN_MISSING);

            const tickit = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID // Your Google Client ID
            });
            const payload = tickit.getPayload();
            if (!payload) {
                throw new AppError(StatusCode.UNAUTHORIZED, "Invalid token payload.");
            }

            // Check if user exists in DB
            let currentUser = await this.authRepo.findUserByEmail(payload.email);

            if (!currentUser) {
                const newUser = {
                    fullName: payload.name,
                    profile: payload.picture,
                    password: "google-oauth",
                    email: payload.email
                }
                currentUser = await this.authRepo.register(newUser);
                if (!currentUser.profile) {
                    currentUser.profile = newUser.profile;
                }
            }
            // Generate the JWT token
            const jwtToken = JwtHelpwer.generateToken({ id: currentUser.id, email: currentUser.email });

            return { user: new UserModel(currentUser), token: jwtToken };
        } catch (error) {
            console.error("Error during Google login:", error);
            throw new AppError(StatusCode.UNAUTHORIZED, "Google login failed.");
        }
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

