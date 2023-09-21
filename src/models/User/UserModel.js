const mongoose = require("mongoose");

//create schema
const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },        
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        address: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
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
    }
);

//Compile schema into model
const User = mongoose.model("User", userSchema);

module.exports = User;
