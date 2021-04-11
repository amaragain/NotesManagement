require('dotenv').config()
const config = require('./../../config/config.json')
const Sequelize = require('sequelize');

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         host: process.env.DB_HOST,
//         dialect: process.env.DB_DIALECT
//     })
    const sequelize = new Sequelize(
        config.development.database,
        config.development.username,
        config.development.password,
        {
            host: config.development.host,
            dialect: config.development.dialect
        })
    
module.exports = sequelize;
global.sequelize = sequelize;  // Setting up the instance as global, Helps calling this without requiring