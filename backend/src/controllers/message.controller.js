const { getSocketId, io } = require("../config/socket");
const MessageService = require("../services/message.service");
const { Response, Message } = require("../utils/response");
const messageService = new MessageService();

class MessageController {
    constructor() {
    }
    async getUsers(req, res, next) {
        try {
            const { userId } = req.user;
            const users = await messageService.getUsers(userId);
            return Response.success(res, Message.SUCCESS, users);
        } catch (error) {
            next(error);
        }
    }
    async sendMessage(req, res, next) {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            const { text, file } = req.body;
            const socketId = getSocketId(id);
            if (socketId) {
                io.to(socketId).emit("newMessage", text);

                console.log("SOCKET : ", socketId);

            }
            return Response.success(res, Message.SUCCESS);
            // const { message } = res.body;
            // const socketId = getSocketId()
        } catch (error) {
            next(error);
        }
    }
}
module.exports = MessageController;