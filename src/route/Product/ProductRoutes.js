const express = require("express");
const { createProductCtrl, updateProductCtrl, getProductCtrl, singleProductCtrl, productPhotoCtrl, deleteProductCtrl, getNewProductsCtrl, searchProductCtrl, filterProductCtrl, relatedProductCtrl ,getTrendingProductsCtrl} = require("../../controller/Product/ProductController");
const router = express.Router();
const multer = require('multer');
const shortid = require('shortid');
const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION
});

const upload = multer({
    storage: multer.memoryStorage() // Limit the file size if needed
});

// CREATE PRODUCT ROUTE 

router.post('/create-product', upload.array('images'), (req, res) => {
    console.log(req.body, req.files);
    const files = req.files;

    // Create an array to store the promises for each image upload
    const uploadPromises = files.map(file => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${shortid.generate()}_${file.originalname}`,
            Body: file.buffer,
            ACL: 'public-read' // Optional: Set the desired access control level
        };

        return s3.upload(params).promise();
    });

    // Execute all upload promises
    Promise.all(uploadPromises)
        .then(uploadedImages => {
            const imageUrls = uploadedImages.map(uploadedImage => uploadedImage.Location);
            createProductCtrl(req, res, imageUrls);
        })
        .catch(error => {
            console.error('Error uploading images:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// UPDATE PRODUCT ROUTE 

router.post('/update-product', upload.array('images'), (req, res) => {
    const files = req?.files;

    if (files) {
        // Create an array to store the promises for each image upload
        const uploadPromises = files.map(file => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${shortid.generate()}_${file.originalname}`,
                Body: file.buffer,
                ACL: 'public-read' // Optional: Set the desired access control level
            };

            return s3.upload(params).promise();
        });

        // Execute all upload promises
        Promise.all(uploadPromises)
            .then(uploadedImages => {
                // Create an array of the uploaded image URLs
                const imageUrls = uploadedImages.map(uploadedImage => uploadedImage.Location);

                // Call the createProduct function with the imageUrls
                updateProductCtrl(req, res, imageUrls);
            })
            .catch(error => {
                console.error('Error uploading images:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }else{
        updateProductCtrl(req,res,null);
    }
});

// GET PRODUCTS ROUTE 
router.get('/get-products/:page', getProductCtrl);

// GET NEWLY ADDED PRODUCTS
router.get('/new-products', getNewProductsCtrl);

// GET SINGLE PRODUCT ROUTE 
router.get('/single-product/:slug', singleProductCtrl);

router.get('/trending-products',getTrendingProductsCtrl );

router.get('/product-photo/:pid', productPhotoCtrl);

router.delete('/delete-product/:pid', deleteProductCtrl);

router.get('/search-product/:keyword/:page', searchProductCtrl);

router.post('/filter-product', filterProductCtrl);

router.get('/related-products/:pid/:cid', relatedProductCtrl);

module.exports = router; 