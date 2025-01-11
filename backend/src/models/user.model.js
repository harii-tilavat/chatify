class UserModel {
    constructor(user) {
        this.id = user.id;
        this.fullName = user.fullName;
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.updateddAt = user.updatedAt;
        this.profile = user.profile;
        this.isActive = user.isActive;
    }
}
module.exports = { UserModel };