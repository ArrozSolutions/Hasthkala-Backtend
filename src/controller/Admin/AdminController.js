const { default: slugify } = require("slugify");
const Product = require("../../models/Product/ProductModel");
const CategoryModel = require('../../models/Category/CategoryModel');
const Order = require("../../models/Order/OrderModel");
const User = require("../../models/User/UserModel");
const Category = require("../../models/Category/CategoryModel");
const sendEmail = require('../../utils/SendMail');

exports.adminCreateProductCtrl = async (req, res, imageUrls) => {
    try {
        const {
            name,
            description,
            price,
            quantity,
            category,
            discountprice
        } = req.body;

        let productImages = [];
        if (imageUrls) {
            if (imageUrls.length > 0) {
                productImages = imageUrls.map(imageUrl => {
                    return { img: imageUrl }
                });
            }
        } else {
            productImages = null
        }

        if (productImages) {

            Product.create({
                name,
                slug: slugify(name),
                description,
                price,
                quantity,
                category,
                images: productImages,
                color: req?.body?.color,
                dimesnions: req?.body?.dimensions,
                countryoforigin: req?.body?.countryoforigin,
                material: req?.body?.material,
                trending: req?.body?.trending,
                additionalinfo: req?.body?.additionalinfo,
                discountprice,
                tags: req?.body?.tags,
            }).then((product) => {
                return res.status(200).json({
                    product
                })
            })
                .catch(err => {
                    return res.status(500).json({
                        success: false,
                        message: err
                    });
                });
        } else {
            Product.create({
                name,
                slug: slugify(name),
                description,
                price,
                quantity,
                category,
                color: req?.body?.color,
                dimesnions: req?.body?.dimensions,
                countryoforigin: req?.body?.countryoforigin,
                material: req?.body?.material,
                trending: req?.body?.trending,
                additionalinfo: req?.body?.additionalinfo,
                discountprice,
                tags: req?.body?.tags,
            }).then((product) => {
                return res.status(200).json({
                    product
                })
            })
                .catch(err => {
                    return res.status(500).json({
                        success: false,
                        message: err
                    });
                });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error" + error
        });
    }
}

exports.adminUpdateProductCtrl = async (req, res, imageUrls) => {
    const {
        pid,
    } = req.body;

    let productImages = [];
    if (imageUrls) {
        if (imageUrls.length > 0) {
            productImages = imageUrls.map(imageUrl => {
                return { img: imageUrl }
            });
        }
    } else {
        productImages = null
    }


    if (productImages) {
        await ProductModel.updateMany({ _id: pid },
            {
                $set:
                {
                    name: req?.body?.name,
                    slug: req?.body?.slug,
                    description: req?.body?.description,
                    price: req?.body?.price,
                    quantity: req?.body?.quantity,
                    category: req?.body?.category,
                    countryoforigin: req?.body?.countryoforigin,
                    color: req?.body?.color,
                    additionalinfo: req?.body?.additionalinfo,
                    dimensions: req?.body?.dimensions,
                    trending: req?.body?.trending,
                    images: productImages,
                    material: req?.body?.material,
                    discountprice: req?.body?.discountprice,
                    tags: req?.body?.tags,


                }
            }
        ).then((updatedProduct) => {
            return res.status(200).json({
                message: "Product Updated"
            })
        })
    } else {
        await ProductModel.updateMany({ _id: pid },
            {
                $set:
                {
                    name: req?.body?.name,
                    slug: req?.body?.slug,
                    description: req?.body?.description,
                    price: req?.body?.price,
                    quantity: req?.body?.quantity,
                    category: req?.body?.category,
                    countryoforigin: req?.body?.countryoforigin,
                    color: req?.body?.color,
                    additionalinfo: req?.body?.additionalinfo,
                    dimensions: req?.body?.dimensions,
                    trending: req?.body?.trending,
                    material: req?.body?.material,
                    discountprice: req?.body?.discountprice,
                    tags: req?.body?.tags,

                }
            }
        ).then((updatedProduct) => {
            return res.status(200).json({
                message: "Product Updated"
            })
        })
    }
}

exports.adminDashboardCtrl = async (req, res) => {
    try {
        return res.status(200).json({
            day,
            orders
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminRecentOrderCtrl = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('uid').limit(10).sort({ createdAt: -1 })
        const delivered = await Order.find({status:"Delivered"});
        const pending = await Order.find({status:"Pending"});
        const proccessing = await Order.find({status:"Proccessing"});
        return res.status(200).json({
            recentorders: orders,
            delivered:delivered.length,
            pending:pending.length,
            proccessing:proccessing.length,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.changeStatusCtrl = async (req, res) => {
    try {
        const { sid,status } = req.body;
        await Order.findByIdAndUpdate(sid,{
            status:status,
        }).then((statusUpdated)=>{
            return res.status(200).json({
                message:"Status Updated to "+status,
            })
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminDeleteRecentOrderCtrl = async (req, res) => {
    try {
        const { oid } = req.body;
        await Order.findByIdAndDelete(oid).then((deletedOrder) => {
            return res.status(200).json({
                message: "Order Deleted Successfully",
                success: true,
            })
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminDeleteCustomerCtrl = async (req, res) => {
    try {
        const { cid } = req.body;
        await User.findByIdAndDelete(cid).then((deletedCustomer) => {
            return res.status(200).json({
                message: "Customer Deleted Successfully",
                success: true,
            })
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminDeleteProductCtrl = async (req, res) => {
    try {
        const { pid } = req.body;
        await Product.findByIdAndDelete(pid).then((deletedProduct) => {
            return res.status(200).json({
                message: "Product Deleted Successfully",
                success: true,
            })
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminDeleteCategoryCtrl = async (req, res) => {
    try {
        const { cid } = req.body;
        await Category.findByIdAndDelete(cid).then((deletedCategory) => {
            return res.status(200).json({
                message: "Category Deleted Successfully",
                success: true,
            })
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminAllOrdersCtrl = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('uid').limit(10).sort({ createdAt: -1 })
        const allorders = await Order.find({})
        const totalorders = allorders.length;
        return res.status(200).json({
            orders: orders,
            totalorders: totalorders,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminAllProductsCtrl = async (req, res) => {
    try {
        const products = await Product.find({}).limit(10).sort({ createdAt: -1 }).populate('category')
        const allproducts = await Product.find({})
        const totalproducts = allproducts.length;
        return res.status(200).json({
            products: products,
            totalproducts: totalproducts,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminAllCategoryCtrl = async (req, res) => {
    try {
        const {skip} = req.body;
        const category = await Category.find({}).limit(10).sort({ createdAt: -1 }).populate('parentid').skip(10 * skip)
        const allcategory = await Category.find({})
        const totalcategory = allcategory.length;
        return res.status(200).json({
            category,
            totalcategory,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminAllCategoryParentCtrl = async (req, res) => {
    try {
        const category = await Category.find({});
        return res.status(200).json({
            category,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminAllCustomersCtrl = async (req, res) => {
    try {
        const { skip } = req.body;
        const customers = await User.find({}).limit(10).skip(skip * 10).sort({ createdAt: -1 })
        const allusers = await User.find({});
        const totalcustomers = allusers.length;
        return res.status(200).json({
            customers,
            totalcustomers
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminCreateHomeCategoryCtrl = async (req, res) => {
    try {
        const { cid } = req.body;
        const category = await Category.findOne({ categoryid: cid });
        if (category) {
            return res.status(200).json({
                message: "Category Allready Created",
                error: true,
                success: false,
            })
        } else {
            Category.create({
                categoryid: cid,
            }).then((categoryCreated) => {
                return res.status(200).json({
                    message: "Category Created",
                    categoryCreated,
                })
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

exports.adminGetHomeCategoryCtrl = async (req, res) => {
    try {
        const category = await Category.find({});
        return res.status(200).json({
            message: "Category Find",
            error: false,
            success: true,
            category
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

exports.adminDeleteHomeCategoryCtrl = async (req, res) => {
    try {
        const {cid}=req.body;
        await Category.findByIdAndDelete(cid).then(()=>{
            return res.status(200).json({
                message:"Category Deleted",
                success:true,
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

exports.adminCreateCategoryCtrl = async (req, res, imageUrls) => {

    let productImages = [];
    if (imageUrls) {
        if (imageUrls.length > 0) {
            productImages = imageUrls.map(imageUrl => {
                return { img: imageUrl }
            });
        }
    } else {
        productImages = null
    }

    try {
        const { name } = req.body;
        const existingCategory = await CategoryModel.findOne({ name });
        if (productImages) {

            CategoryModel.create({
                name,
                slug: slugify(name),
                images: productImages,
                parentid: req?.body?.parentid,
            }).then((category) => {
                return res.status(200).json({
                    category
                })
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.adminUpdateCategoryCtrl = async (req, res, imageUrls) => {
    const {
        pid,
    } = req.body;

    let productImages = [];
    if (imageUrls) {
        if (imageUrls.length > 0) {
            productImages = imageUrls.map(imageUrl => {
                return { img: imageUrl }
            });
        }
    } else {
        productImages = null
    }

    if (productImages) {
        await Category.updateMany({ _id: pid },
            {
                $set:
                {
                    name: req?.body?.name,
                    slug: req?.body?.slug,
                    images: productImages,
                }
            }
        ).then((updatedCategory) => {
            return res.status(200).json({
                message: "Category Updated"
            })
        })
    } else {
        await Category.updateMany({ _id: pid },
            {
                $set:
                {
                    name: req?.body?.name,
                    slug: req?.body?.slug,
                }
            }
        ).then((updatedCategory) => {
            return res.status(200).json({
                message: "Category Updated"
            })
        })
    }
}

exports.contactUsMailCtrl = async (req, res) => {
    try {
        const {name,email,phone,message}=req.body;
        var msg = `Hasthkala Contact-Us:\nName: ${name}\nEmail: ${email}\nMobile Number: ${phone}\nMessage: ${message}`
        await sendEmail('brickgold62@gmail.com', `${name}: Contacted You!`,msg).then((emailSent) => {
            return res.status(200).json({
                message: "Message sent",
                emailSent: true,
            })
        }).catch((error) => {
            return res.status(400).json({
                message: error
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"+error
        })
    }
}