const express = require("express");
const AuthController = require("../controllers/auth.controller");
const { userLoginValidationSchema, validationHandler, userRegisterValidationSchema } = require("../validation");
const { authMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

const authController = new AuthController();

// --------------- /api/auth ------------------


router.post("/login", userLoginValidationSchema, validationHandler, authController.login);

router.post("/register", userRegisterValidationSchema, validationHandler, authController.register);

router.post("/check-auth", authMiddleware, authController.checkAuth);

router.post("/logout", authController.logout);

module.exports = router;