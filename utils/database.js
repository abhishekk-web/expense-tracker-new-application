const Sequelize = require('sequelize');

const sequelize = new Sequelize("expense-tracker-new-application", "root", "nodecomplete", {

    dialect: "mysql",
    host: "localhost"

})

module.exports = sequelize;