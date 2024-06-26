const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./Users');

const Workout = sequelize.define('Workout', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
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
    type: DataTypes.TEXT
  },
  image_url: {
    type: DataTypes.STRING
  },
  video_url: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'Workouts'
});

User.hasMany(Workout, { foreignKey: 'user_id' });
Workout.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Workout;
