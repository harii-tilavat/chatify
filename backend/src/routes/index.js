const express = require("express");
const AuthController = require("../controllers/auth.controller");

const router = express.Router();

// Auth Routes
AuthController.register(router)

module.exports = router;