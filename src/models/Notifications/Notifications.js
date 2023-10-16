const mongoose = require('mongoose');

const notificationsSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message:{
        type:String,
    },
    orderdata:{
        type:JSON,
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
