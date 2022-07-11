const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    conversationType: { type: String, required: true },
    recipients: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }],
 });

module.exports = mongoose.model('Conversation', conversationSchema, 'conversations');