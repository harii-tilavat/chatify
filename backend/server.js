const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());

app.use("/api", require("./src/routes"));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
});
module.exports = app;