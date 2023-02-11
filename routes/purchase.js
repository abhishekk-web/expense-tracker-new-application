const express = require('express');

const router = express.Router();

const purchaseController = require('../controllers/purchase');
const authController = require("../middleware/auth");

router.get("/premiummembership", authController.authenticate, purchaseController.purchase);

router.post("/updatetransactionstatus", authController.authenticate, purchaseController.update)

module.exports = router;