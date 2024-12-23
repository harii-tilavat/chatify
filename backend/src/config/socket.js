const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // origin: "http://localhost:5173",
        methods: ["GET", 'POST'],
        credentials: true
    }
});

// used to store online users
const onlineUsersMap = new Map(); // {userId: socketId}
const getSocketId = (userId) => {
    return onlineUsersMap.get(userId);
}
// Handle socket connections
io.on("connection", (socket) => {
    const { userId, username } = socket.handshake.query;
    console.log("Socket connected : ", { id: socket.id, userId, username });
    // onlineUsersMap.set(userId, socket.id)
    onlineUsersMap.set(userId, socket.id);
    console.log("MAP : ", onlineUsersMap);

    io.emit("getOnlineUsers", [...onlineUsersMap.keys()]);

    socket.on("disconnect", (reason) => {
        console.log("Socket Disconnected: ", reason);
        onlineUsersMap.delete(userId);
        console.log("MAP : ", onlineUsersMap);
        io.emit("getOnlineUsers", [...onlineUsersMap.keys()]);
    })
});

// Handle socket connections
// io.on("connection", (socket) => {
//     console.log("Socket connected : ", socket);

//     // Handle user disconnecting
//     socket.on("disconnect", (socket) => {
//         console.log("A user disconnected. ", socket);
//     })
// })

module.exports = { io, server, app, getSocketId };