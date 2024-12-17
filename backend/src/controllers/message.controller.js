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
}
module.exports = MessageController;