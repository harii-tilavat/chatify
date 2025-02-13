const { getSocketId, io } = require("../config/socket");
const { AppError } = require("../middlewares/error-handler.midllerware");
const MessageService = require("../services/message.service");
const { Response, Message, StatusCode } = require("../utils/response");
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
            const { id } = req.params;
            const { text } = req.body;

            if (!id) throw new AppError(StatusCode.BAD_REQUEST, Message.REQUIRED_FIELDS_MISSING);
            const { userId } = req.user;
            const updatedMessage = await messageService.sendMessage(userId, id, text, req.file);
            return Response.created(res, Message.CREATED, updatedMessage);
        } catch (error) {
            next(error);
        }
    }
    async getMessages(req, res, next) {
        try {
            const { id } = req.params;
            const { userId } = req.user;

            if (!id) throw new AppError(StatusCode.BAD_REQUEST, Message.REQUIRED_FIELDS_MISSING);

            const messages = await messageService.getMessages(userId, id);
            return Response.success(res, Message.SUCCESS, messages);
        } catch (error) {
            next(error);
        }
    }
    async deleteMessages(req, res, next) {
        try {
            const { userId } = req.user;
            await messageService.deleteMessages(userId, req.body);
            return Response.success(res, Message.SUCCESS);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = MessageController;