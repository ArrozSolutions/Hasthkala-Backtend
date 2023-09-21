const express = require("express");
const { createOrderCtrl, getAllOrderCtrl } = require("../../controller/Order/OrderController");
const router = express.Router();
require('dotenv').config();

router.post('/create-order', createOrderCtrl);
router.get('/get-all-orders', getAllOrderCtrl);

module.exports = router; 