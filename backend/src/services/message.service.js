const MessageRepo = require("../repositories/message.repo");

class MessageService{
    constructor(){
        this.MessageRepo = new MessageRepo();
    }
}
module.exports = MessageService;