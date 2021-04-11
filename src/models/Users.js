const Sequelize = require('sequelize');
const sequelize = require('../db/connection');

module.exports = sequelize.define("Users", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(200),
        allowNull: false
    }
});