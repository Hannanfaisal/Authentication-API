const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_SECRET_KEY} = require("../config/index");

const userController = {

    async userRegistration(req,res){
       
        try {
            const {name, email, password, tc, confirm_password} = req.body;
            const user = await UserModel.findOne({email});
            if(user){
                return res.status(401).json({"status":"failed","message":"Email already registered"});
            }

            if(name && email && password && tc && confirm_password){
                if(password === confirm_password){
                    const hashPassword = await bcrypt.hash(password,10);
                    let doc;
                    try {
                        doc = new UserModel({
                            name, 
                            email, 
                            password: hashPassword, 
                            tc
                    });
                    
                    await doc.save();
                    const savedUser = await UserModel.findOne({email});
                    const token = jwt.sign({userID: savedUser._id},JWT_SECRET_KEY,{
                        expiresIn: '5m'
                    });

                    return res.status(201).json({"status":"success","message":"User registered","token": token});

                    } catch (error) {
                        return res.status(400).json({"status":"failed","message":"Client Error"});
                    }

                    
                }else{
                    return res.status(400).json({"status":"failed","message":"Confirm password does not matches"});
                }
            }else{
                return res.status(400).json({"status":"failed","message":"All fields are required"});
            }
        }catch(error){
            return res.status(500).json({"status":"failed","message":"Internal server error"});            
        }
    },

    async userLogin(req,res){
        try {

            const {email,password} = req.body;
            
            if(email && password){
                const user = await UserModel.findOne({email});
                if(!user){
                    return res.status(401).json({"status":"failed","message":"Not a  registered user"});
                }
                const match = await bcrypt.compare(password, user.password); 
                if(match){
                    const token = jwt.sign({userID:user._id},JWT_SECRET_KEY,{
                        expiresIn: '5m'
                    })
                    return res.status(200).json({"status":"success","message":"User logged In","token":token});
                }else{
                    return res.status(401).json({"status":"failed","message":"Enter a valid password"});
                }
            }else{
                return res.status(400).json({"status":"failed","message":"Enter all fields"});
            }
            
        } catch (error) {
            return res.status(500).json({"status":"failed","message":"Internal server error"})
        }
    },

    async changePassword(req,res){
        try {
            const {password, confirm_password} = req.body;
            if(password && confirm_password){
                if(password != confirm_password){
                    return res.status(400).json({"status":"failed","message":"Confirm password does not matches"});
                }
                const hashPassword = await bcrypt.hash(password,10);

               console.log(req.user); 

                return res.status(200).json({"status":"success","message":"Password changed successfully"})
                
            }
            else{
                return res.status(400).json({"status":"failed","message":"All fields are required"})
            }
        } catch (error) {
            return res.status(500).json({"status":"failed","message":"Internal server error"});
        }
    }


}


module.exports = userController;