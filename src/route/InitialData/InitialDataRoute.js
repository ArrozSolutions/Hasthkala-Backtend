const express = require('express');
const {initialDataCtrl} = require('../../controller/InitialData/InitialDataController');
const router = express.Router();

router.get('/initialdata',initialDataCtrl);

module.exports = router;