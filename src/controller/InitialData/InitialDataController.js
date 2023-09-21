const Category = require('../../models/Category/CategoryModel');
const Product = require('../../models/Product/ProductModel');
const User = require('../../models/User/UserModel');

exports.initialDataCtrl = async(req,res)=>{
    const categories = await Category.find({});
    const newproducts = await Product.find({}).limit(4).sort({createdAt:-1});
    // const enquiries = await Enquiry.findAll();
    const users = await User.find({});
    const totalUsers = users.length;

    if ( categories && newproducts) {
        return res.json({
            newproducts,
            categories,
        })
    }
}
