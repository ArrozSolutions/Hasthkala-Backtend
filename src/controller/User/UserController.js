const User = require('../../models/User/UserModel');
const twilio = require('twilio');
const saltRounds = 11;
const bcrypt = require("bcryptjs");
const { ExternalCampaignListInstance } = require('twilio/lib/rest/messaging/v1/externalCampaign');
const sendEmail = require('../../utils/SendMail');


exports.userSignUp = async (req, res) => {
    try {
        const {
            email,
            phone,
            fullname,
        } = req.body;

        const userFound = await User.findOne({ email });
        if (!userFound) {

            let password = req.body.password;
            User.create({
                fullname,
                email,
                phone,
                password: password,
            }).then(savedUser => {
                return res.status(200).json({
                    success: true,
                    user: {
                        _id: savedUser?._id,
                        fullname: savedUser?.fullname,
                        email: savedUser?.email,
                        phone: savedUser?.phone,
                    },
                });
            })
                .catch(err => {
                    return res.status(500).json({
                        success: false,
                        message: "Internal server error"
                    });
                });
        } else {
            return res.status(400).json({
                success: false,
                message: "User Already Registered"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound) {
        return res.status(401).json({
            message: "User Not Registered",
        })
    }

    if (userFound && (userFound?.password == password)) {
        return res.status(200).json({
            user: {
                _id: userFound?._id,
                fullname: userFound?.fullname,
                email: userFound?.email,
                city: userFound?.city,
                state: userFound?.state,
                address: userFound?.address,
                phone: userFound?.phone,
            }
        })
    } else {
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

}

exports.updateUser = async (req, res) => {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email });

    if (userFound && (userFound?.password == password)) {
        await User.updateMany({ email: email }, {
            $set: {
                fullname: req.body?.fullname,
                city: req.body?.city,
                state: req.body?.state,
                address: req.body?.address,
                phone: req.body?.phone,
            }
        }).then((updatedUser) => {
            return res.status(200).json({
                user: {
                    _id: userFound?._id,
                    fullname: req.body.fullname,
                    email: req.body.email,
                    city: req.body.city,
                    phone: req.body.phone,
                    state: req.body.state,
                    address: req.body.address,
                }
            })
        }).catch((error) => {
            return res.status(400).json({
                message: "Error = " + error
            })
        })
    } else {
        return res.status(400).json({
            message: "Password is Incorrect"
        })
    }
}


exports.getUserById = async (req, res) => {
    const { id } = req.body;
    try {
        const userFound = await User.findOne({ id: id })
        if (userFound) {
            return res.status(200).json({
                id: userFound?.id,
                email: userFound?.email,
                fullname: userFound?.fullname,
                phone: userFound?.phone,
            })
        } else {
            return res.status(400).json({
                message: "Cannot get user",
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while getting user",
        });
    }
}

exports.userLoginWithOtp = async (req, res) => {
    const { phone } = req.body;
    console.log("mno" + phone);
    const userFound = await User.findOne({ phone: phone });
    if (userFound) {
        return res.status(200).json({
            user: {
                _id: userFound?._id,
                fullname: userFound?.fullname,
                email: userFound?.email,
                city: userFound?.city,
                phone: userFound?.phone,
                state: userFound?.state,
                address: userFound?.address,
            }

        });
    } else {
        res.status(401).json({
            message: "Invalid OTP"
        })
    }

}
exports.emailVerification = async (req, res) => {
    const { email, subject } = req.body;
    try {
        const userFound = await User.findOne({ email: email });
        if(!userFound){
            return res.status(402).json({
                message:"User Does Not Exist"
            })
        }
        let otp = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
        otp.toString();
        await sendEmail(email,"Email Verification",`${otp}`).then((emailSent) => {
            console.log("Email Sent");
            return res.status(200).json({
                message: "Email sent",
                emailSent: true,
                otp: otp,
            })
        }).catch((error) => {
            return res.status(400).json({
                otpSent: false,
                message: error
            })
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
            emailSent: false
        })
    }
}


exports.mobileNoVerificatiion = async (req, res) => {
    const { phone } = req.body;
    var newPhone = phone.split("+91")[1];
    console.log(newPhone);
    const userFound = await User.findOne({ phone: newPhone });
    if(!userFound){
        return res.status(402).json({
            message:"User Does Not Exist!"
        })
    }
 
    console.log(phone)

    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = twilio(accountSid, authToken, process.env.VIRTUAL_NUMBER);

    let otp = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
    otp.toString();

    const message = `Your OTP is: ${otp}`;

    if (process.env.PRODUCTION) {
        client.messages
            .create({
                body: message,
                from: process.env.VIRTUAL_NUMBER,
                to: phone
            })
            .then((message) => {
                res.status(200).json({
                    otp: otp,
                    message: "OTP send successfully"
                })
            }
            )
            .catch((error) => {
                res.status(401).json({
                    message: `Error sending OTP + ${error}`
                })
            });
    }
    else {
        console.log(otp);
        return res.status(200).json({
            otp: otp,
            message: "OTP send successfully"
        })

    }

};