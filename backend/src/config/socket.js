const { Server } = require("socket.io");

const onlineUsers = new Map();
const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5174",
            methods: ["GET", 'POST'],
            credentials: true
        }
    });

    // Handle socket connections
    io.on("connection", (socket) => {
        const { userId, username } = socket.handshake.query;
        console.log("Socket connected : ", { id: socket.id, userId, username });
        // onlineUsers.set(userId, socket.id)
        onlineUsers.set(userId, socket.id);
        console.log("MAP : ", onlineUsers);
        
        
        
        socket.on("disconnect", (reason) => {
            console.log("Socket Disconnected: ", reason);
            onlineUsers.delete(userId);
            console.log("MAP : ", onlineUsers);
        })
    });
    return io;
}

// Handle socket connections
// io.on("connection", (socket) => {
//     console.log("Socket connected : ", socket);

//     // Handle user disconnecting
//     socket.on("disconnect", (socket) => {
//         console.log("A user disconnected. ", socket);
//     })
// })

module.exports = { initializeSocket };