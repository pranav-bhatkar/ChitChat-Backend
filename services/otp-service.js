const crypto = require("crypto");
const nodemailer = require('nodemailer');
const hashservices = require("./hash-services");

const smssid = process.env.SMS_SID;
const smsauthtoken = process.env.SMS_AUTH_TOKEN;
const twilio = require("twilio")(smssid, smsauthtoken, { lazyLoading: true });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'techxpo.contact@gmail.com',
    pass: 'erzongznzofqbrlj'
  }
});


class Otpservice {
  async generateOtp() {
    const otp = crypto.randomInt(111111, 999999);
    return otp;
  }

  // async sendBySms(phone, otp) {
  //   return await twilio.messages.create({
  //     to: phone,
  //     from: process.env.SMS_FORM_NUMBER,
  //     body: `Your ChitChat OTP is ${otp} 
  //               NOTE:- Do not shere this code with any one else..!`,
  //   });
  // }
  async sendByEmail(email, otp) {
const mailOptions = {
  from: 'techxpo.contact@gmail.com',
  to: email,
  subject: 'To Verify you on ChitChat',
  text: `Your one time password is ${otp}.
  do not share this code with anyone else 😜`
};
  transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
  }

  async verifyOtp(hashedOtp, data) {
    const computedHash = await hashservices.hashotp(data);
    return computedHash === hashedOtp;
    
  }
}

module.exports = new Otpservice();
