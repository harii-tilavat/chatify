const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./src/routes");
const { errorHandlerMiddleware } = require("./src/middlewares/error-handler.midllerware");
const { server, app } = require("./src/config/socket");
// ------------------


// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Your React app's origin
    credentials: true, // Allow credentials like cookies
})); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
// app.use(morgan("dev"));


// Centralized routes under /api
app.use("/api", routes); // Prefix API routes with '/api'

// Global Error Handler
app.use(errorHandlerMiddleware);

// Load environment variables
dotenv.config();

// Define the port
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});