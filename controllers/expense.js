const Expense = require('../models/expense');   // here we are requiring the expense model

// this is the controller of adding the expense into the database

exports.addExpense = async (req, res) => {

    try {

    const {expense, description, category} = req.body;
        const userId = req.user.id;
        console.log(userId);
    const data = await req.user.createExpense({expense:expense, description:description, category:category});
    res.status(200).json({success: true, message: "successfully saving expense", data:data});

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