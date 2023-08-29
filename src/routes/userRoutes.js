const express = require("express");
const userController = require("../controllers/UserController");
const checkUserAuth = require("../middlewares/auth")
const userRouter = express.Router();


userRouter.post('/register', userController.userRegistration);
userRouter.post('/login',userController.userLogin);

userRouter.post('/change-password', checkUserAuth ,userController.changePassword);

userRouter.post('/send-reset-email',userController.sendPasswordResetEmail);

userRouter.post('/reset-password/:id/:token',userController.resetPassword);


module.exports = userRouter;