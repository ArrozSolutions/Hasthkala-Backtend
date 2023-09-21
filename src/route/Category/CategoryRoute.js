const express = require("express");
const { createCategoryCtrl, updateCategoryCtrl,allCategoriesCtrl, singleCategoryCtrl, deleteCategoryCtrl } = require("../../controller/Category/CategoryController");
const router = express.Router();
const multer = require('multer');
const shortid = require('shortid');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION
});

const upload = multer({
    storage: multer.memoryStorage() // Limit the file size if needed
});

router.post('/create-category', upload.array('images'), (req, res) => {
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
            createCategoryCtrl(req, res, imageUrls);
        })
        .catch(error => {
            console.error('Error uploading images:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

router.put('/update-category/:id',updateCategoryCtrl);
router.get('/get-category',allCategoriesCtrl);
router.get('/single-category/:slug',singleCategoryCtrl);
router.delete('/delete-category/:id',deleteCategoryCtrl);

module.exports = router; 