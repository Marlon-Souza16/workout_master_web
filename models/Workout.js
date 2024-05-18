// models/Workout.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./Users');

const Workout = sequelize.define('Workout', {
  day: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  muscle_group: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
  },
  video_url: {
    type: DataTypes.STRING,
  }
});

User.hasMany(Workout, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Workout.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Workout;
