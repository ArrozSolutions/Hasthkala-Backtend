const { default: slugify } = require("slugify");
const CategoryModel = require('../../models/Category/CategoryModel');

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