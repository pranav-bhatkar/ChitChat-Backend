
const jwt = require("jsonwebtoken");
const refreshModule = require("../models/refresh-module");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

class TokenService {
   generateTokens(payload) {
      const accessToken = jwt.sign(payload, accessTokenSecret, {
         expiresIn: '1m'
      } );
      
      const refreshToken = jwt.sign(payload, refreshTokenSecret, {
         expiresIn: '1y'
      } );

      return { accessToken, refreshToken }


   }
   
   async storeRefreshToken(token, userId){
      try {
         await refreshModule.create({
            token,
            userId,
         })
      } catch (error) {
         console.log(error);
      }
   }
   async varifyAccessToken(token) {
      return jwt.verify(token, accessTokenSecret);
   } 
   async verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, refreshTokenSecret);
    }
  async findRefreshToken(userId, refreshToken) {
        return await refreshModule.findOne({
            userId: userId,
            token: refreshToken,
        });
    }

    async updateRefreshToken(userId, refreshToken) {
        return await refreshModule.updateOne(
            { userId: userId },
            { token: refreshToken }
        );
    }

    async removeToken(refreshToken) {
        return await refreshModule.deleteOne({ token: refreshToken });
    }
   }

module.exports = new TokenService();