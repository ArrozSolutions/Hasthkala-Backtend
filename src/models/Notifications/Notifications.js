const mongoose = require('mongoose');

const notificationsSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message:{
        type:String,
    },
    orderName:{
        type:String,
    },
    orderPrice:{
        type:String,
    },
    orderId:{
        type:String,
    },
    type:{
        type:String,
        required:true,
    },
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

const Notifications = mongoose.model("Notifications",notificationsSchema);
module.exports = Notifications;
