const Order = require("../../models/Order/OrderModel");
const User = require("../../models/User/UserModel");

exports.createOrderCtrl = async (req, res) => {
    try {
        var userUpdated=false;
        const {
            uid,
            cartdata,
            status,
            paymentmode,
            totalprice,
            usertype,
        } = req.body;


        if(usertype == "incomplete"){
            await User.updateMany({_id:uid},{
                $set:{
                    fullname:req?.body?.fullname,
                    email:req?.body?.email,
                    phone:req?.body?.phone,
                    country:req?.body?.country,
                    city:req?.body?.city,
                    state:req?.body?.state,
                    address:req?.body?.address,
                    zipcode:req?.body?.zipcode,
                    usertype:'complete',
                }
            }).then((updatedUser)=>{
            }).catch((error)=>{
                console.log(error,21);
            })
            userUpdated=true;
        }

        Order.create({
            uid,
            cartdata,
            status,
            paymentmode,
            totalprice
        }).then((order) => {
            if(userUpdated){
                return res.status(200).json({
                    message: "Order Created Successfully",
                    userUpdated:true,
                })
            }else{
                return res.status(200).json({
                    message: "Order Created Successfully",
                })   
            }
        })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

exports.getAllOrderCtrl = async (req, res) => {
    try {
        const orders = await Order.find({});
        return res.status(200).json({
            orders
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

exports.getUserOrdersCtrl = async (req, res) => {
    try {
        const { uid } = req.body;
        const orders = await Order.find({uid:uid});
        return res.status(200).json({
            orders
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

