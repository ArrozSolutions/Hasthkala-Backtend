const GoogleStrategy = require('passport-google-oauth2')
const passport = require('passport');
const User = require('./models/User/UserModel');

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_AUTH_ID,
    clientSecret:process.env.GOOGLE_AUTH_SECRET,
    callbackURL:"/api/google-callback",
    passReqToCallback:true,
},

function(request,accessToken,refreshToken, profile, callback){  
    // const userFound = await User.findOne({googleid:profile.id});
    // if(!userFound){
    //     User.create({
    //         fullname,
    //         googleid,
    //         avatar,
    //         email,
    //         usertype:"google"
    //     }).then((savedUser)=>{
    //        console.log("User Created"); 
    //     }).catch((err)=>{
    //         console.log(err);
    //     })
    // }
    console.log(accessToken,refreshToken, profile);
    callback(null,profile);
}));

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((user,done)=>{
    done(null,user);
})
