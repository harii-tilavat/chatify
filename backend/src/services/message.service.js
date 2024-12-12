const MessageRepo = require("../repositories/message.repo");

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
}
module.exports = MessageService;