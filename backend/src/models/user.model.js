class UserModel {
    constructor(user) {
        this.id = user.id;
        this.fullName = user.fullName;
        this.email = user.email;
    }
}
module.exports = { UserModel };