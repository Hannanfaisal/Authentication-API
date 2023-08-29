const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_SECRET_KEY} = require("../config/index");
const transporter = require("../config/emailConfig");
const { EMAIL_FROM} = require("../config/index")


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
                        expiresIn: '15m'
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
                        expiresIn: '15m'
                    })
                    return res.status(200).json({"status":"success","message":"User logged In","token":token, "user":user});
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

                const c = await UserModel.findByIdAndUpdate(req.user._id,{$set:{password: hashPassword}});

                console.log(c)

                return res.status(200).json({"status":"success","message":"Password changed successfully"})
                
            }
            else{
                return res.status(400).json({"status":"failed","message":"All fields are required"})
            }
        } catch (error) {
            return res.status(500).json({"status":"failed","message":"Internal server error"});
        }
    },

    async sendPasswordResetEmail(req,res){
       
        const {email} = req.body;
        if(email){
            const user = await UserModel.findOne({email});
            if(!user){
                return res.status(401).json({"status":"failed","message":"User is not registered"});
            }
            const secret = user._id+JWT_SECRET_KEY;
            const token = jwt.sign({userID: user._id},secret,{expiresIn:'15m'});
            const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
            console.log(link);
            let info;
               try {
                 info = await transporter.sendMail({
                from: EMAIL_FROM, // sender address
                to: user.email, // list of receivers
                subject: "RESET YOUR PASSWORD", // Subject line
                html: `<h1>Reset Your Password-Click Here<a href=${link}>Link</a></h1>`, // html body
              });
               } catch (error) {
                  return res.status(401).json({"status":"failed","message":"Email failed to sent"})
               }
            

            return res.status(200).json({"status":"success","message":"Email sent, check your email","info":info})
        }else{
            return res.status(400).json({"status":"failed","message":"Email is required"})
        }

    },


    async resetPassword(req,res){

        try {
            
        const {password, confirm_password} = req.body;
        const {id, token} = req.params;
        const user = await UserModel.findById({_id:id});
        const new_secret =user._id + JWT_SECRET_KEY;
        try {
            const {userID} = jwt.verify(token,new_secret);
        console.log(user);

        } catch (error) {
            return res.status(400).json({"status":"failed","message":"Invalid Token"})  
        }
            if(password && confirm_password){
                if(password === confirm_password){
                    const hashPassword = await bcrypt.hash(password,10);
                    await UserModel.findByIdAndUpdate(user._id,{$set:{password: hashPassword}});
                    return res.status(200).json({"status":"success","message":"Password reset"})
                }
                else{
                    return res.status(400).json({"status":"failed","message":"Confirm password does not mstches "})  
                }
            }
            else{
                return res.status(400).json({"status":"failed","message":"All fields are required"}); 
            }
        } catch (error) {
            return res.status(400).json({"status":"failed","message":"Internal Server Error"}); 
        }



    }


}


module.exports = userController;