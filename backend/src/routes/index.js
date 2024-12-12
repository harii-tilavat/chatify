const express = require("express");
const router = express.Router();

// Auth Routes
router.use("/auth", require("./auth.routes"));


module.exports = router;