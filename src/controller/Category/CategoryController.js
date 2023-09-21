const { default: slugify } = require("slugify");
const CategoryModel = require('../../models/Category/CategoryModel');

exports.createCategoryCtrl = async (req, res, imageUrls) => {
    let productImages = [];
    if (imageUrls.length > 0) {
        productImages = imageUrls.map(imageUrl => {
            return { img: imageUrl }
        });
    }
    console.log("Pm = " + productImages[0].img);
    try {
        const { name } = req.body;
        const existingCategory = await CategoryModel.findOne({ name });
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
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}


exports.updateCategoryCtrl = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await CategoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        return res.status(200).json({
            message: "Category Updated",
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.allCategoriesCtrl = async (req, res) => {
    try {
        const category = await CategoryModel.find({});
        if (category) {
            return res.status(200).json({
                category
            })
        } else {
            return res.status(401).json({
                message: "Cannot Get Categories"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}


exports.singleCategoryCtrl = async (req, res) => {
    try {
        const category = await CategoryModel.findOne({ slug: req.params.slug });
        if (category) {
            return res.status(200).json({
                category
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.deleteCategoryCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        await CategoryModel.findByIdAndDelete(id)
        return res.status(200).json({
            message: "Category Deleted Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}