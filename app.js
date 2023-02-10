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


// we are using all the routes here

app.use("/user",userRoutes);

// our server is running here

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})







