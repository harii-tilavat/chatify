const prisma = require("../config/prismaClient");
const { DBError } = require("../middlewares/error-handler.midllerware");

class AuthRepo {
    async register(user) {
        try {
            const { fullName, email, password } = user;
            // Create a new user record in the database.
            const newUser = await prisma.user.create({
                data: {
                    fullName,
                    password,
                    email
                }
            });
            return newUser;
        } catch (error) {
            throw new DBError(error);
        }
    }
    async findUserByEmail(email) {
        try {
            // Use `findFirst` for finding a single user by email
            const user = await prisma.user.findFirst({ where: { email } });
            return user;
        } catch (error) {
            throw new DBError(error);
        }
    }
    async updateProfile(userId, profile) {
        try {
            return await prisma.user.update({ data: { profile }, where: { id: userId } });
        } catch (error) {
            throw new DBError(error);
        }
    }
}
module.exports = AuthRepo;