const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('node-connect','root','password', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;
