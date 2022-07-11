const otpservice = require("../services/otp-service");
const hashservices = require("../services/hash-services");
const otpService = require("../services/otp-service");
const userServices = require("../services/user-services");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/userDtos");

class Authcontroller {
  async sendOtp(req, res) {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "phone number is required..!" });
    }

    const otp = await otpservice.generateOtp();

    const ttl = 1000 * 60 * 2;
    const expires = Date.now() + ttl;
    const data = `${email}.${otp}.${expires}`;
    const hash = await hashservices.hashotp(data);
     try {
       //await otpService.sendBySms(phone, otp);
        await otpService.sendByEmail(email, otp);
        return res.json({
         hash: `${hash}.${expires}`,
         email,
         otp,
       });
     } catch (err) {
       res.status(500).json({ message: "message sending failed" });
     }
  }
  async verifyOtp(req, res) {
    const { otp, hash, email } = req.body;
    if (!otp || !hash || !email) {
      res.status(400).json({ message: "All fields are required!" });
    }

    const [hashedOtp, expires] = hash.split(".");

    if (Date.now() > expires) {
      res.status(400).json({ message: "OTP Expired..!" });
      return
    }

    const data = `${email}.${otp}.${expires}`;
    const isValid = await otpService.verifyOtp(hashedOtp, data);
    if (!isValid) {
      res.status(400).json({ message: "Invalid OTP..!" });
      return;
    }

    let user;

    try {
      user = await userServices.findUser({ email });
      if(!user){
      user = await userServices.createUser({ email })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'database error'})    
    }

     const { accessToken, refreshToken } = tokenService.generateTokens({ 
       _id: user._id,
       activated: false,
     });

     await tokenService.storeRefreshToken(refreshToken, user._id);
    try {
     res.cookie( 'refreshToken', refreshToken, {
       maxAge: 1000 * 60 * 60 * 24 * 30,
       sameSite: "none",
       secure: true,
       httpOnly: true
     });
     res.cookie( 'accessToken', accessToken, {
       maxAge: 1000 * 60 * 60 * 24 * 30,
       httpOnly: true,
       sameSite: "none",
        secure: true,
     });
    } catch (e) {
      console.log(e)
    }



     const userDto = new UserDto(user)

     res.send({ user: userDto, auth: true });

  }
  async checkUser(req, res) {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ message: "All fields are required!" });
    }
    let user;
    try {
      user = await userServices.findUser({ phone });
      if(!user){
        res.send({ user: null });
      }else{
        const userDto = new UserDto(user)
        res.send({ user: userDto });
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'database error'})    
    }
    
     

  }
  async getUser(req, res) {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ message: "All fields are required!" });
    }
    let user;
    try {
      user = await userServices.findUserById(id);
      if(!user){
        res.send({ user: null });
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'database error'})    
    }
     const userDto = new UserDto(user)
     res.send({ user: userDto });
  }
  async refresh(req, res) {
    
        console.log("refresh called");
        // get refresh token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        // check if token is valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(
                refreshTokenFromCookie
            );
        } catch (err) {
            return res.status(401).json({ message: 'Invalid Token1' });
        }
        // Check if token is in db
        try {
            const token = await tokenService.findRefreshToken(
                userData._id,
                refreshTokenFromCookie
            );
            if (!token) {
                return res.status(401).json({ message: 'Invalid token2' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Internal error' });
        }
        // check if valid user
        const user = await userServices.findUser({ _id: userData._id });
        if (!user) {
            return res.status(404).json({ message: 'No user' });
        }
        // Generate new tokens
        const { refreshToken, accessToken } = tokenService.generateTokens({
            _id: userData._id,
        });

        // Update refresh token
        try {
            await tokenService.updateRefreshToken(userData._id, refreshToken);
        } catch (err) {
            return res.status(500).json({ message: 'Internal error' });
        }
        // put in cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        // response
        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });
    }
  async logout(req, res) {
        const { refreshToken } = req.cookies;
        // delete refresh token from db
        await tokenService.removeToken(refreshToken);
        // delete cookies
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json({ user: null, auth: false });
    }
}

module.exports = new Authcontroller();
