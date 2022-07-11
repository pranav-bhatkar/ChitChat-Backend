class UserDto {
    id;
    email;
    phone;
    pubkey;
    name;
    avatar;
    activated;
    createdAt;

    constructor(user) {
        this.id = user._id;
        this.email = user.email;
        this.phone = user.phone;
        this.pubkey = user.pubkey;
        this.name = user.name;
        this.avatar = user.avatar;
        this.activated = user.activated;
        this.createdAt = user.createdAt;
    }
}

module.exports = UserDto;