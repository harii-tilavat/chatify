const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const MessageController = require("../controllers/message.controller");
const router = express.Router();

const messageController = new MessageController();

// --------------- /api/messages ------------------


router.get("/users", authMiddleware, messageController.getUsers);

module.exports = router;