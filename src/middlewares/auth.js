const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY} = require("../config/index");
const UserModel = require("../models/User");

const checkUserAuth = async(req,res,next)=>{
    let token;
    const {authorization} = req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        try {
           token = authorization.split(' ')[1];
          const {userID} = jwt.verify(token,JWT_SECRET_KEY);
          req.user = await UserModel.findById(userID).select('-password' );

          next();
        } catch (error) {
            return res.status(401).json({"status":"failed","message":"Unauthorized User"})
        } 
    }else{
        return res.status(401).json({"status":"failed","message":"UnAuthorized User, Invalid Token"})
    }
    if(!token){
        return res.status(401).json({"status":"failed","message":"UnAuthorized User, No Token available"})
    }
    console.log(authorization);
}

module.exports = checkUserAuth;

