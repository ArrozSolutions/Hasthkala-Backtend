const Razorpay = require("razorpay")
const crypto = require('crypto');

exports.checkoutPayment = async(req,res)=>{
    try{
        const Instance = new Razorpay({
            key_id:process.env.RAZORPAY_ID,
            key_secret:process.env.RAZORPAY_SECRET,
        })

        const options = {
            amount:req.body.amount*100,
            currency:"INR",
            receipt:crypto.randomBytes(10).toString("hex")
        }

        Instance.orders.create(options,(error,order)=>{
            if(error){
                return res.status(400).json({
                    message:error
                })
            }
            console.log(order)
            return res.status(200).json({
                order
            })
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

exports.verifyPayment = async (req,res)=>{
    try{
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        } = req.body;
        const sign = razorpay_payment_id;
        const expectSign = crypto
            .createHmac("sha256",'uQWsLENJXKZc2C6YiLSjzWB6')
            .update(sign.toString())
            .digest("hex");

        if(razorpay_signature === expectSign){
            return res.status(200).json({
                message:"Payment Verified!"
            })
        }else{
            return res.status(400).json({
                message:"Invalid Signature!"
            })      
        }

    }catch(error){
        return res.status(500).json({
            message:error
        })
    }
}