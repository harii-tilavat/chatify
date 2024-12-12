const app = require("./src/app");
const dotenv = require("dotenv");
const http = require("http");
const { initializeSocket } = require("./src/config/socket");
// Load environment variables
dotenv.config();

// Define the port
const PORT = process.env.PORT || 8080;

// Create http server
const server = http.createServer(app);

// Initialize the Socket.IO server
initializeSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
