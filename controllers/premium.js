const User = require('../models/user');
const Expense = require('../models/expense');

exports.premium = async (req, res) => {

    try {

        const user = await User.findAll();
        const expense = await Expense.findAll();
        console.log(expense);
        const userAggregatedExpenses = {};
        expense.forEach((expense) => {

            if(userAggregatedExpenses[expense.userId]){

                userAggregatedExpenses[expense.userId] += expense.expense;

            }else{
                userAggregatedExpenses[expense.userId] = expense.expense;
            }

        })

        var userLeaderBoardDetails = [];
        user.forEach((user) => {
            userLeaderBoardDetails.push({name: user.name, total_cost: userAggregatedExpenses[user.id]|| 0});

        })
        console.log(userLeaderBoardDetails);

        userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);
        res.status(200).json(userLeaderBoardDetails);

    }
    catch(err){
        console.log(err);
    }

}