const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const MessageController = require("../controllers/message.controller");
const upload = require("../middlewares/upload.middlerware");
const router = express.Router();

const messageController = new MessageController();

// --------------- /api/messages ------------------


router.get("/users", authMiddleware, messageController.getUsers);
router.post("/send/:id", authMiddleware, upload.single("file"), messageController.sendMessage);

module.exports = router;