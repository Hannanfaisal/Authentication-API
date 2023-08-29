const express = require("express");
const userController = require("../controllers/UserController");
const checkUserAuth = require("../middlewares/auth")
const userRouter = express.Router();


userRouter.post('/register', userController.userRegistration);
userRouter.post('/login',userController.userLogin);

userRouter.post('/changepassword', checkUserAuth ,userController.changePassword)



module.exports = userRouter;