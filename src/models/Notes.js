const Sequelize = require('sequelize');
const sequelize = require('../db/connection');

module.exports = sequelize.define("Notes", {
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
    note: {
        type: Sequelize.STRING(200),
        allowNull: false
    }
});