const prisma = require("../config/prismaClient");
class MessageRepo {
    async getUsers(userId) {
        return prisma.user.findMany({
            where: {
                id: {
                    not: userId
                }
            }
        })
    }
}
module.exports = MessageRepo;