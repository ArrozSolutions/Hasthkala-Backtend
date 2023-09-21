const { default: slugify } = require("slugify");
const ProductModel = require("../../models/Product/ProductModel");

exports.createProductCtrl = async (req, res, imageUrls) => {
    try {
        const {
            name,
            description,
            price,
            quantity,
            category,
            shipping,
        } = req.body;
        console.log(req.body, imageUrls);

        let productImages = [];
        if (imageUrls.length > 0) {
            productImages = imageUrls.map(imageUrl => {
                return { img: imageUrl }
            });
        }
        console.log("Name = " + name);

        ProductModel.create({
            name,
            slug: slugify(name),
            description,
            price,
            shipping,
            quantity,
            category,
            images: productImages,
            color:req?.body?.color,
            dimesnions:req?.body?.dimensions,
            countryoforigin:req?.body?.countryoforigin,
            material:req?.body?.material,
            trending:req?.body?.trending,
            additionalinfo:req?.body?.additionalinfo
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
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


exports.updateProductCtrl = async (req, res, imageUrls) => {
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
                    images:productImages,
                    material:req?.body?.material
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
                    material:req?.body?.material
                }
            }
        ).then((updatedProduct) => {
            return res.status(200).json({
                message: "Product Updated"
            })
        })
    }
}


exports.getNewProductsCtrl = async (req, res) => {
    try {
        const products = await ProductModel.find({}).populate('category').limit(4).sort({ createdAt: -1 })
        return res.status(200).json({
            products
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error
        })
    }
}

exports.getTrendingProductsCtrl = async (req, res) => {
    try {
        const products = await ProductModel.find({trending:true}).populate('category').limit(8)
        return res.status(200).json({
            products
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error
        })
    }
}


exports.getProductCtrl = async (req, res) => {
    try {
        const perPage = 8;
        const page = req.params.page;
        const products = await ProductModel.find({}).populate('category').limit(perPage * page)
        return res.status(200).json({
            products
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.singleProductCtrl = async (req, res) => {

    try {
        const product = await ProductModel.findOne({ slug: req.params.slug }).populate('category');
        return res.status(200).json({
            product
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.productPhotoCtrl = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await ProductModel.findById(pid).select("images");
        console.log(product.images[0].img)
        if (product.images) {
            // res.set("Content-Type",product?.images[0].img.type)
            return res.status(200).send(
                product.images[0].img
            )
        }
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.deleteProductCtrl = async (req, res) => {
    try {
        const { pid } = req.params;
        await ProductModel.findByIdAndDelete(pid).select('-images');
        return res.status(200).json({
            message: "Product Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.searchProductCtrl = async (req, res) => {
    try {
        const perPage = 8;
        const { keyword, page } = req.params;
        console.log(keyword);
        const result = await ProductModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { color: { $regex: keyword, $options: "i" } },
                { additionalinfo: { $regex: keyword, $options: "i" } },
                { material: { $regex: keyword, $options: "i" } },
            ]
        }).limit(perPage * page).populate('category')
        return res.status(200).json({
            products: result
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}


exports.filterProductCtrl = async (req, res) => {
    try {
        const perPage = 8;
        const { checked, value, page } = req.body;
        let args = {}
        if (checked.length > 0) args.category = checked
        if (value.length > 0) args.price = { $gte: value[0], $lte: value[1] }
        const products = await ProductModel.find(args).limit(perPage * page).populate('category');
        return res.status(200).json({
            products: products
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.relatedProductCtrl = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await ProductModel.find({
            category: cid,
            _id: { $ne: pid }
        }).limit(4);
        return res.status(200).json({
            products: products
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}