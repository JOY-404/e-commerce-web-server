const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const OrderDetail = sequelize.define('orderdetails', {
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    totalAmt: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

module.exports = OrderDetail;