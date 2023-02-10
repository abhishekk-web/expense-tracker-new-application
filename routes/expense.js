const express = require('express');

const router = express.Router();

// here these are the controllers that we required

const expenseController = require('../controllers/expense');

// here we are using all the functions of the expense controller

router.get("/expenses", expenseController.getExpense);

router.post("/addexpense", expenseController.addExpense);

router.delete("/deleteexpense/:id", expenseController.deleteExpense);

module.exports = router;