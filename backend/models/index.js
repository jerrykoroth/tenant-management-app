const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('hostel_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const Tenant = sequelize.define('Tenant', {
  name: DataTypes.STRING,
  contact: DataTypes.STRING,
  roomId: DataTypes.INTEGER,
});

sequelize.sync();
module.exports = { sequelize, Tenant };
