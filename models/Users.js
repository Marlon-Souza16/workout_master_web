const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

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
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  has_workout_routine: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

Users.beforeCreate(async (Users, options) => {
  const salt = await bcrypt.genSalt(10);
  Users.password = await bcrypt.hash(Users.password, salt);
});

module.exports = Users;
