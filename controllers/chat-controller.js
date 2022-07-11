const uuid4 = require("uuid4");
const userServices = require("../services/user-services");
const ChatServices = require("../services/chat-service");
const MessageServices = require("../services/message-services");


class ChatController {
  async getUsers(req, res) {
    const { email } = req.body;
    const users = await userServices.getAllUsers(['true'], email);
    return res.json(users);
  }
  async getConversations(req, res) {
    const { owner } = req.body;
    const conversations = await ChatServices.getConversations(owner);
    return res.json(conversations);
  }
  async getConversation(req, res) {
    const { id } = req.body;
    const conversations = await ChatServices.findOneConversation(id);
    return res.json(conversations);
  }
  async getChat(req, res) {
    const { chatId } = req.body;
    const conversation = await ChatServices.findOneConversation(chatId);
    const chat = await MessageServices.findMessage({ chatId });
    return res.json({conversation, chat});
  }
  async createConversation(req, res){
    const { recipients, conversationType } = req.body;
    if (!recipients || !conversationType) {
      res.status(400).json({ message: "All fields are required!" });
    }
    let conversation;
    try {
      conversation = await ChatServices.findConversation(recipients)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'database error'})    
    }
    if(conversation === null){
    try {
      conversation = await ChatServices.createConversation({recipients, conversationType})
      return res.json({conversation});
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'database error'})    
    }
   }
     return res.json({conversation});
  }
  async sendMsg(req, res) {
    const { chatId, recipient, payload, type, time, status } = req.body;
    if (!chatId || !payload || !recipient || !status || !type || !time) {
      res.status(400).json({ message: "All fields are required!" });
    }
    let message;
    try {
      message = await MessageServices.sendMsg({ chatId, recipient, payload, type, time, status })
      return res.json(message);
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'database error'})    
    }
  }
  async getAllMsgs(req, res) {
    const { chatId } = req.body;
    const messages = await MessageServices.findMessage({ chatId });
    return res.json(messages);
  }
  
}


module.exports = new ChatController();
