const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('WorkoutMasterDB', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
