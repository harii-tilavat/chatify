const MessageRepo = require("../repositories/message.repo");
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
            return await this.messageRepo.sendMessage(senderId, receiverId, message)
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
}
module.exports = MessageService;