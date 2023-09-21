const mongoose = require("mongoose");

// NAME
// SLUG
// DESCRIPTION
// DIMENSIONS
// COLOR
// MATERIAL
// COUNTRY OF ORIGIN
// ADDITIONAL INFO
// PRICE
// CATEGORY
// QUANTITY
// SHIPPING
// TRENDING

//create schema
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug:{
            type:String,
            required:true,
            lowercase:true,
        },
        description:{
            type:String,
            required:true,
        },
        dimensions:{
            type:String,
        },
        color:{
            type:String,
        },
        material:{
            type:String,
        },
        countryoforigin:{
            type:String,
        },
        additionalinfo:{
            type:String,
        },
        price:{
            type:Number,
            required:true,
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
        },
        images:{
            type:JSON,
        },
        shipping:{
            type:Boolean,
        },
        trending:{
            type:Boolean,
            default:false,
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
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
