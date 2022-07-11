const userModel = require("../models/user-model");
const UserDto = require("../dtos/userDtos");

class UserServices {

    async findUser(filter) {
        const user = await userModel.findOne(filter);
        return user;
    }
    async findUserById(id) {
        const user = await userModel.findById(id);
        return user;
    }
    async createUser(data) {
        const user = await userModel.create(data);
        return user;
    }
    async getAllUsers(types, email) {
        const users = await userModel.find({$and:[{ activated: { $in: types } }, { email: { $nin: [`${email}`] } }]  });
        const userDto = users.map((user) => new UserDto(user))
        return userDto;
    }
}

module.exports = new UserServices();