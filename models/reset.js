const Sequelize = require("sequelize");
const sequelize = require('../utils/database');

const ForgotPasswords = sequelize.define('forgotpassword', {

    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE

})

module.exports = ForgotPasswords;