const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../utils/database');

exports.premium = async (req, res) => {

    try {

        const users = await User.findAll({

            order: [['totalExpense', "DESC"]]  // it is for sorting the total cost in a descending order

        });

            console.log(users);
            return res.status(200).json({users});

    }
    catch(err){
        console.log(err);
    }

}