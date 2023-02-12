const Expense = require('../models/expense');   // here we are requiring the expense model
const User = require('../models/user');

// this is the controller of adding the expense into the database

exports.addExpense = async (req, res) => {

    try {

    const {expense, description, category} = req.body;
        const userId = req.user.id;
        const amount = req.user.totalExpense;
        console.log(userId);
        console.log(amount);
        const expenses = await Expense.create({expense:expense, description:description, category:category, userId: req.user.id})
            const totalExpense = Number(req.user.totalExpense) + Number(expenses.expense);
            console.log(totalExpense);
            await User.update({totalExpense:totalExpense}, {where: {id: req.user.id}})
            res.status(200).json({success: true, message: "successfully added expense",expense:expenses})

    }
    catch(err){
        console.log(err);
    }

}

// here in this controller we are sending all data from the database to frontend

exports.getExpense = async (req, res) => {

    try {
        const userId = req.user.id;
        const data = await Expense.findAll({where:{userId:userId}});
        res.status(200).json({data:data});

    }
    catch(err){
        console.log(err);
    }

}

// this controller is used to delele the expenses from the database

exports.deleteExpense = async (req, res) => {

    try {
        const userid = req.user.id;
        const expenseId = req.params.id;

        if(expenseId == undefined || expenseId === 0){
            res.status(400).json({success: false})
        }

        const data = await Expense.destroy({where: {id:expenseId, userId: userid}});

        if(data === 0){
            return res.status(400).json({success: false, messsage: "This expense is not belong to the user"});
        }

        res.status(200).json({message: "expense successfully deleted"});

    }
    catch(err){
        console.log(err);
    }

}