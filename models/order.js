const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    orderDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    totalAmt: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

module.exports = Order;