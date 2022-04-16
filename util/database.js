const {Sequelize} = require('sequelize');

// const sequelize = new Sequelize('node-connect','root','password', {
//     dialect: 'mysql', 
//     host: 'localhost'
// });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PW, {
    dialect: 'mysql',
    host: process.env.DB_HOST
});

module.exports = sequelize;
