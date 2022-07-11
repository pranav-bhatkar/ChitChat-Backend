class ChatlistDto {
    id;
    email;
    phone;
    name;
    avatar;
    activated;
    createdAt;

    constructor(chatlist) {
        this.id = chatlist._id;
        this.email = chatlist.email;
        this.phone = chatlist.phone;
        this.name = chatlist.name;
        this.avatar = chatlist.avatar;
        this.activated = chatlist.activated;
        this.createdAt = chatlist.createdAt;
    }
}

module.exports = ChatlistDto;