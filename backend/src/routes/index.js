const express = require("express");
const router = express.Router();

// Auth Routes
router.use("/auth", require("./auth.routes"));

// Messages Routes
router.use("/messages", require("./message.routes"));


module.exports = router;