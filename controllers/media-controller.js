const otpservice = require("../services/otp-service");
const hashservices = require("../services/hash-services");
const otpService = require("../services/otp-service");
const userServices = require("../services/user-services");
const ContactServices = require("../services/contact-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/userDtos");


class Mediacontroller {
  async getAvatar(req, res) {
    const id = req.query.id;
    if(!id){
      res.status(500).json({ message: "id is required" });
    }
         let user;
    try {
        user = await userServices.findUserById(id);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: `message sending failed ${id}` });
    }
    if(!user.id){
        res.status(401).send('culd not found image!');
    } else {
       if(user.id === id){
        res.sendFile(`./${user.avatar}`, { root: "./" });
 } else {
      res.send({user});
      res.send(`can't find user of use image`);
 }
      
    }
}
  async getName(req, res) {
    const id = req.query.id;
    if(!id){
      res.status(500).json({ message: "id is required" });
    }
         let user;
    try {
        user = await userServices.findUser({ id });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "message sending failed" });
    }
    if(!user){
        res.status(401).send('culd not found image!');
    } else {
       if(user.id === id){
         const name = user.name;
        res.send({ name  });
 } else {
      res.send(`can't find user of use image`);
 }
      
    }
}
  async createContact(req, res) {
    const {user, phone, name, owner} = req.body;
    if(!user || !phone || !name || !owner){
      res.status(500).json({ message: "all fields are required" });
    }
    let contact
    try {
      contact = await ContactServices.findContact({ phone });
      if(!contact){
      contact = await ContactServices.createContact({ user, phone, name, owner })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'database error'})    
    }
   return res.send({ contact });
}
  async getContacts(req, res) {
    const { owner } = req.body;
    if(!owner){
      res.status(500).json({ message: "all fields are required" });
    }
    let contacts
    try {
      contacts = await ContactServices.findContacts({ owner });
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'database error'})    
    }
    return res.json(contacts);
}
}
module.exports = new Mediacontroller();
