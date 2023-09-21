const { default: slugify } = require("slugify");
const Cart = require('../../models/Cart/CartModel');
const Product = require("../../models/Product/ProductModel");
const SaveForLater = require('../../models/SaveForLater/SaveForLaterModel');

exports.addToCartCtrl = async (req, res) => {
    try {
        const { pid, uid, quantity, initialquantity } = req.body;
        const cartFound = await Cart.findOne({ userid: uid, productid: pid })
        if (cartFound) {
            return res.status(400).json({
                message: "Already Added",
            })
        }
        Cart.create({
            userid: uid,
            productid: pid,
            quantity: quantity,
        }).then(async(cart) => {
            await Product.updateMany({_id:pid},{
                $set:{
                    quantity: initialquantity - quantity
                }
            }).then((updateProduct)=>{
                return res.status(200).json({
                    cart
                })
            })
        }).catch(err => {
            console.log(err)
            return res.status(500).json({
                success: false,
                message: err
            });
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error
        })
    }
}

exports.quantityEditCtrl = async (req, res) => {
    try {
        const { cid, quantity } = req.body;
        const cartFound = await Cart.findOne({ _id:cid })
        Cart.updateMany({_id:cid},{
            $set:{
                quantity:req?.body?.quantity
            }
        }).then((updated)=>{
            return res.status(200).json({
                message:"Quantity Updated"
            })
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error
        })
    }
}

exports.getSavedProducts = async(req,res)=>{
    try{
        const {uid} = req.body;
        const savedProducts = await SaveForLater.find({uid:uid}).populate("pid");
        return res.status(200).json({
            status:"Success",
            savedProducts
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Internal Server Error",
        })
    }
}

exports.saveForLater = async(req,res)=>{
    try {
        const { pid,uid } = req.body;
        SaveForLater.create({
            uid,
            pid
        }).then((saved)=>{
            return res.status(200).json({
                message:"Saved For Later",
            })
        })

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.getCartDataCtrl = async (req, res) => {
    try {
        const { uid } = req.body;
        const cartFound = await Cart.find({ userid: uid }).populate("productid")
        return res.status(200).json({
            cart: cartFound
        })

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.deleteCartItemCtrl = async (req, res) => {
    try {
        const { cid,initialquantity } = req.body;
        const cartFound = await Cart.findOne({_id:cid});
        const pid = cartFound?.productid;
        const qty = cartFound?.quantity;
        await Cart.findByIdAndDelete(cid).then(async(success) => {
            await Product.updateMany({_id:pid},{
                $set:{
                    quantity: initialquantity + qty
                }
            }).then((updatedProduct)=>{
                return res.status(200).json({
                    message: "Cart Item Removed Successfully"
                })
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}


