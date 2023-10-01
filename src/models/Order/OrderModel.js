const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cartdata: {
        type: JSON,
        required: true,
    },
    totalprice: {
        type: String,
        required: true,
    },
    paymentmode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
    }
},
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true,
    })

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
