// All the express libraries that we are requiring in node js

const express= require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// we are require the database here

const sequelize = require('./utils/database');

// the express libraries that we are using

const app = express();
app.use(bodyParser.json({extended: false}));
app.use(cors());

// All the routes that are required are here

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

// here we are requiring all the models

const user = require('./models/user');
const expense = require('./models/expense');

// we are using all the routes here

app.use("/user",userRoutes);
app.use("/expense", expenseRoutes);

// here we are doing the associations

user.hasMany(expense);
expense.belongsTo(user);

// our server is running here

sequelize
// .sync({force:true})
.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})







