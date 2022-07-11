const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    chatId: { type: String, required: true },
    recipient: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    payload: { type: String, required: true },
    type: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, required: true },
    created_at: Date,
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema, 'messages');