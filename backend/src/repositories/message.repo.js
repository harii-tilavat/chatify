const prisma = require("../config/prismaClient");
const { DBError } = require("../middlewares/error-handler.midllerware");
class MessageRepo {
    async getUsers(userId) {
        try {
            return prisma.user.findMany({
                where: {
                    id: {
                        not: userId
                    }
                }
            })
        } catch (error) {
            throw new DBError(error);
        }
    }
    async sendMessage(senderId, receiverId, message) {
        try {
            const { image, text } = message;
            return prisma.message.create({
                data: { receiverId, senderId, text, image, isRead: false }
            });
        } catch (error) {
            throw new DBError(error);
        }
    }
}
module.exports = MessageRepo;