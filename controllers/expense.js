const Expense = require('../models/expense');   // here we are requiring the expense model

// this is the controller of adding the expense into the database

exports.addExpense = async (req, res) => {

    try {

    const {expense, description, category} = req.body;

    const data = await Expense.create({expense:expense, description:description, category:category});
    res.status(200).json({success: true, message: "successfully saving expense", data:data});

    }
    catch(err){
        console.log(err);
    }

}

// here in this controller we are sending all data from the database to frontend

exports.getExpense = async (req, res) => {

    try {

        const data = await Expense.findAll();
        res.status(200).json({data:data});

    }
    catch(err){
        console.log(err);
    }

}

// this controller is used to delele the expenses from the database

exports.deleteExpense = async (req, res) => {

    try {

        const expenseId = req.params.id;
        const data = await Expense.destroy({where: {id:expenseId}});
        res.status(200).json({message: "expense successfully deleted"});

    }
    catch(err){
        console.log(err);
    }

}