const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    cartdata:{
        type:JSON,
        required:true,
    },
    orderby:{
        type:JSON,
        required:true,
    },
    totalprice:{
        type:String,
        required:true,
    },
    paymentmode:{
        type:String,
        required:true
    }
})

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
