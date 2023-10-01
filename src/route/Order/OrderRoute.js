const express = require("express");
const { createOrderCtrl, getAllOrderCtrl, getUserOrdersCtrl } = require("../../controller/Order/OrderController");
const router = express.Router();
require('dotenv').config();

router.post('/create-order', createOrderCtrl);
router.get('/get-all-orders', getAllOrderCtrl);
router.post('/get-user-orders',getUserOrdersCtrl)

module.exports = router; 