const express = require("express");
const router = express.Router();
const {userLogin,userSignUp, updateUser,userLoginWithOtp,googleAuth, googleCallback, getUserById} = require('../../controller/User/UserController')
const passport = require('passport');

router.post('/login',userLogin);
router.post('/signinotp',userLoginWithOtp);
router.post('/signup',userSignUp);
router.post('/updateuser',updateUser);
router.post('/get-user',getUserById);

router.get('/login-success',(req,res)=>{
    if(req.user){
        return res.status(200).json({
            error:false,
            message:"Login Success",
            user:req.user,
        })
    }
})

router.get('/login-failed',(req,res)=>{
    return res.status(401).json({
        error:true,
        message:"Login Failure",
    })
})

router.get('/google-callback',
    passport.authenticate('google',{
        successRedirect:'http://localhost:3000/',
        failureRedirect:'/api/login-failed',
    })
)
router.get("/google",passport.authenticate("google",{scope:['email','profile']}));


module.exports = router; 