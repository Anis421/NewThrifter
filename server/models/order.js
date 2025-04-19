const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  items: { type: DataTypes.TEXT, allowNull: false }, // JSON stringified
  shippingName: { type: DataTypes.STRING, allowNull: false },
  shippingEmail: { type: DataTypes.STRING, allowNull: false },
  shippingAddress: { type: DataTypes.STRING, allowNull: false },
  total: { type: DataTypes.FLOAT, allowNull: false },
  paymentStatus: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' }
});

module.exports = Order;
