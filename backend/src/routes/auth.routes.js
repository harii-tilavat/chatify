const express = require("express");
const AuthController = require("../controllers/auth.controller");
const { userLoginValidationSchema, validationHandler, userRegisterValidationSchema } = require("../validation");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middlerware");
const router = express.Router();

const authController = new AuthController();

// --------------- /api/auth ------------------


router.post("/login", userLoginValidationSchema, validationHandler, authController.login);

router.post("/register", userRegisterValidationSchema, validationHandler, authController.register);

router.post("/check-auth", authMiddleware, authController.checkAuth);

router.post("/update-profile", authMiddleware, upload.single("file"), authController.updateProfile);

router.post("/logout", authController.logout);

module.exports = router;