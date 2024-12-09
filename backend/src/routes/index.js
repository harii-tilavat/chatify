const express = require("express");
const AuthController = require("../controllers/auth.controller");

const router = express.Router();

// Auth Routes
const authController = new AuthController();
authController.register(router);

module.exports = router;