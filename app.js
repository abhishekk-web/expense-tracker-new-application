// All the express libraries that we are requiring in node js

const express= require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");

// we are require the database here

const sequelize = require('./utils/database');

// the express libraries that we are using

const app = express();
app.use(bodyParser.json({extended: false}));
app.use(cors());
dotenv.config();

// All the routes that are required are here

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');

// here we are requiring all the models

const user = require('./models/user');
const expense = require('./models/expense');
const purchase = require('./models/purchase');

// we are using all the routes here

app.use("/user",userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use('/premium', premiumRoutes);

// here we are doing the associations

user.hasMany(expense);
expense.belongsTo(user);

user.hasMany(purchase);
purchase.belongsTo(user);

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







