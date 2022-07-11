const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    pubkey: { type: String, required: false },
    phone: { type: String, required: false },
    name: { type: String, required: false },
    avatar: {
            type: String,
            required: false,
            // get: (avatar) => {
            //     if (avatar) {
            //         return `${process.env.API_URL}${avatar}`;
            //     }
            //     return avatar;
            // },
        },
    email: { type: String, required: true },
    activated: { type: Boolean, required: false, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema, 'users');
