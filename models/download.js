const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const expense = sequelize.define('fileUrl', {
 
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fileUrl: {
        type: Sequelize.STRING,
        allowNull: false
    }

})

module.exports = expense;