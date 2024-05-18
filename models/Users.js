// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Users = sequelize.define('Users', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  profile_image: {
    type: DataTypes.STRING,
  },
  has_workout_routine: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Users;
