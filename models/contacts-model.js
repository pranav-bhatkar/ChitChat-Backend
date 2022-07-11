const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    owner: { type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema, 'contacts');
