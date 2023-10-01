const { default: slugify } = require("slugify");
const Product = require("../../models/Product/ProductModel");
const CategoryModel = require('../../models/Category/CategoryModel');
const Order = require("../../models/Order/OrderModel");
const User = require("../../models/User/UserModel");
const Category = require("../../models/Category/CategoryModel");

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
        console.log(req.body, imageUrls);

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

exports.adminRecentOrderCtrl = async (req, res) => {
    try {
        const orders = await Order.find({}).limit(10).sort({ createdAt: -1 })
        return res.status(200).json({
            recentorders: orders,
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
        const orders = await Order.find({}).limit(10).sort({ createdAt: -1 })
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
        const category = await Category.find({}).limit(10).sort({ createdAt: -1 })
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

exports.adminAllCustomersCtrl = async (req, res) => {
    try {
        const customers = await User.find({}).limit(10).sort({ createdAt: -1 })
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
                images: productImages
            }).then((category) => {
                return res.status(200).json({
                    category
                })
            })
            if (Category) {
                return res.status(200).json({
                    success: true,
                    message: "Category Created = " + Category
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}


