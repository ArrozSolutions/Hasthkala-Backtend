const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        lowercase:true,
    },
    images:{
        type:JSON,
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

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
