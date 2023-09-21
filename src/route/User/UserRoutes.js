const express = require("express");
const router = express.Router();
const {userLogin,userSignUp, updateUser,userLoginWithOtp} = require('../../controller/User/UserController')

router.post('/login',userLogin);
router.post('/signinotp',userLoginWithOtp);
router.post('/signup',userSignUp);
router.post('/updateuser',updateUser);

module.exports = router; 