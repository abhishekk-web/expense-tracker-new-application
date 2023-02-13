const Expense = require('../models/expense');   // here we are requiring the expense model
const User = require('../models/user');
const downloads = require('../models/download');
const S3Services = require('../services/S3services');
const userservice = require('../services/userservices');

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
        
        const ITEMS_PER_PAGE = 2;

        // we are getting the page number through query
        const page = +req.query.page || 1;
        console.log("page no is "+page);
        var totalItems;

        const userId = req.user.id;
        
        // we are counting the expenses
        await Expense.count({where: {userId: userId}}).then((data)=> {
            totalItems = data;

            // then we are returning the expenses with pagination
            return Expense.findAll({where: 
                    {userId: userId},
                    offset: (page - 1) * ITEMS_PER_PAGE,
                    limit: ITEMS_PER_PAGE 
                });
            }).then(datas=>{
                res.json({
                data: datas,
                currentPage: page,
                hasnextPage: ITEMS_PER_PAGE * page < totalItems,
                nextPage: +page + 1,
                hasPreviousPage: page > 1,
                previousPage: +page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                })
                console.log(datas);
            })
        

        
        // res.status(200).json({data:data});

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

// we are calling the download function here

exports.download = async(req, res) => {

    try {

        const expenses = await userservice.getExpenses(req);
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);

        const userId = req.user.id;

        const filename = `Expenses${userId}/${new Date()}.txt`;
        const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
        res.status(200).json({fileURL, success: true})
        await downloads.create({fileUrl: fileURL, userId: userId});
        

    }

    catch(err){
        console.log(err);
    }

}