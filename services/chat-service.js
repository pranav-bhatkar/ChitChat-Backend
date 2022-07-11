const conversationModel = require("../models/conversation-model");


class ChatServices {
    async createConversation(data) {
        const conversation = await conversationModel.create(data);
        return conversation;
    }
    async findConversation(recipients) {
        const conversation = await conversationModel.findOne({recipients: recipients})
        .exec();
        return conversation;
    }
    async getConversations(owner) {
        const conversation = await conversationModel.find({recipients: owner})
        .populate('recipients', '_id name avatar phone pubkey')
        .exec();
        return conversation;
    }
    async findOneConversation(id) {
        const conversation = await conversationModel.findById(id)
        .populate('recipients', '_id name avatar phone pubkey')
        .exec();
        return conversation;
    }
}

module.exports = new ChatServices();