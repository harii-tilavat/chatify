const { getSocketId, io } = require("../config/socket");
const { AppError } = require("../middlewares/error-handler.midllerware");
const MessageRepo = require("../repositories/message.repo");
const { StatusCode, Message } = require("../utils/response");
const FileUploader = require("../utils/uploader");

class MessageService {
    constructor() {
        this.messageRepo = new MessageRepo();
    }
    async getUsers(userId) {
        try {
            const users = await this.messageRepo.getUsers(userId);
            return users;
        } catch (error) {
            throw error;
        }
    }
    async sendMessage(senderId, receiverId, text, file) {
        try {
            let message = { text, image: null };
            if (file) {
                const image = await FileUploader.uploadStream(file.buffer);
                message = { ...message, image };
            }
            const newMessage = await this.messageRepo.sendMessage(senderId, receiverId, message);
            const receiverSocketId = getSocketId(receiverId);
            io.to(receiverSocketId).emit("newMessage", newMessage);
            return newMessage;
        } catch (error) {
            throw error;
        }
    }
    async getMessages(senderId, receiverId) {
        try {
            return this.messageRepo.getMessages(senderId, receiverId);
        } catch (error) {
            throw error;
        }
    }
    async deleteMessages(userId, body) {
        try {
            const { messageIds = [], isDeletedBySender, isDeletedByReceiver } = body;
            const newStatus = {};
            
            // Set the flags in the newStatus object based on the request
            if (isDeletedBySender) {
                newStatus.isDeletedBySender = true;
            }
            if (isDeletedByReceiver) {
                newStatus.isDeletedByReceiver = true;
            }

            // Validate if there are message IDs and the newStatus has at least one flag set
            if (!messageIds.length || !Object.keys(newStatus).length) {
                throw new AppError(StatusCode.BAD_REQUEST, Message.INVALID_PARAMS);
            }

            // Call the repository method to update the messages
            await this.messageRepo.deleteMessages(userId, messageIds, newStatus);
        } catch (error) {
            throw error;
        }
    }
}
module.exports = MessageService;