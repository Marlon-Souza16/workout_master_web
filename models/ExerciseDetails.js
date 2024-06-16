const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExerciseDetails = sequelize.define('ExerciseDetails', {
  exercise_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  muscle_group: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING
  },
  video_url: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = ExerciseDetails;
