const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./Users');

const Workout = sequelize.define('Workout', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
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
  image_url: {
    type: DataTypes.STRING,
  },
  video_url: {
    type: DataTypes.STRING,
  }
}, {
  timestamps: false,
});

User.hasMany(Workout, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Workout.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Workout;
