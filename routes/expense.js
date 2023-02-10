const express = require('express');

const router = express.Router();

// here these are the controllers that we required

const expenseController = require('../controllers/expense');
const authController = require("../middleware/auth");

// here we are using all the functions of the expense controller

router.get("/expenses", authController.authenticate, expenseController.getExpense);

router.post("/addexpense", authController.authenticate, expenseController.addExpense);

router.delete("/deleteexpense/:id", authController.authenticate, expenseController.deleteExpense);

module.exports = router;