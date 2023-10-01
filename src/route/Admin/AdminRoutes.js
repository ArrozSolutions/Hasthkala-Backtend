const express = require("express");
const { adminCreateProductCtrl, adminCreateCategoryCtrl, adminUpdateProductCtrl, adminRecentOrderCtrl, adminAllCustomersCtrl, adminAllOrdersCtrl, adminAllProductsCtrl, adminAllCategoryCtrl } = require("../../controller/Admin/AdminController");
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


router.post('/admin-create-product', upload.array('images'), (req, res) => {
console.log(req?.body)
const files = req?.files

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
                adminCreateProductCtrl(req, res, imageUrls);
            })
            .catch(error => {
                console.error('Error uploading images:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }else{
        adminCreateProductCtrl(req,res,null);
    }
});



// UPDATE PRODUCT ROUTE 

router.post('/admin-update-product', upload.array('images'), (req, res) => {
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
                adminUpdateProductCtrl(req, res, imageUrls);
            })
            .catch(error => {
                console.error('Error uploading images:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }else{
        adminUpdateProductCtrl(req,res,null);
    }
});


router.post('/admin-create-category', upload.array('images'), (req, res) => {
    const files = req?.files;

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
            adminCreateCategoryCtrl(req, res, imageUrls);
        })
        .catch(error => {
            console.error('Error uploading images:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



// router.post('/admin-create-category')
// router.post('/admin-update-category')
router.get('/admin-all-category',adminAllCategoryCtrl)
router.get('/admin-all-products',adminAllProductsCtrl)
router.get('/admin-all-orders',adminAllOrdersCtrl)
router.get('/admin-all-customers',adminAllCustomersCtrl)
router.get('/admin-recent-orders',adminRecentOrderCtrl)

module.exports = router; 