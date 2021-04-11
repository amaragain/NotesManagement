const Sequelize = require('sequelize');
const sequelize = require('../db/connection');

module.exports = sequelize.define("Tokens", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false
    },
    refreshToken: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    accessToken: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});