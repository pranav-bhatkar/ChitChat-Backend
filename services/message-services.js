const Message = require("../models/message-model");

class MessageServices {

    async sendMsg(data) {
        const message = await Message.create(data);
        return message;
    }
    async findMessage(chatId) {
        const messages = await Message.find(chatId)
        .populate('recipient', '_id name avatar pubkey')
        .exec();
        return messages;
    }
}

module.exports = new MessageServices();