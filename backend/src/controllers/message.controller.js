const MessageService = require("../services/message.service");

class MessageController {
    constructor() {
        this.MessageService = new MessageService();
    }
    register(app) {
        app.route("/messages")
            .route("/",async(req, res, next) => {
                try {
                    res.json({ data: [1, 2, 3] });
                } catch (error) {
                    next(error);
                }
            })
    }
}
module.exports = MessageController;