const Order = require("../../models/Order/OrderModel");

exports.createOrderCtrl = async (req, res) => {
    try {
        const {
           cartdata,
           orderby,
           paymentmode,
           totalprice
        } = req.body;

        Order.create({
            cartdata,
            orderby,
            paymentmode,
            totalprice
        }).then((order) => {
            return res.status(200).json({
                message:"Order Created Successfully"
            })
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

exports.getAllOrderCtrl = async(req,res)=>{
    try{
        const orders = await Order.find({});
        return res.status(200).json({
            orders
        })
    }catch(error){
        return res.status(400).json({
            message:error
        })
    }
}

