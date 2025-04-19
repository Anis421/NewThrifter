const sequelize = require('./db');
const User = require('./user');
const Order = require('./order');

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Order };
