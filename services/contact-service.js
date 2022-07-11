const userModel = require("../models/user-model");
const contactModel = require("../models/contacts-model");
const UserDto = require("../dtos/userDtos");

class ContactServices {

    async findContact(filter) {
        const contact = await contactModel.findOne(filter).exec();
        return contact;
    }
    async findContacts(filter) {
        const contacts = await contactModel.find(filter)
        .populate('user', '_id avatar pubkey')
        .exec();
        return contacts;
    }
    async createContact(data) {
        const contact = await contactModel.create(data);
        return contact;
    }
}

module.exports = new ContactServices();