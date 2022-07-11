const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatlistSchema = new Schema({
    chatId: { type: String, required: true },
    chatType: { type: String, required: true },
    margeId: { type: String, required: true },
    user1: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    created_at: Date,
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chatlist', chatlistSchema, 'chatlists');