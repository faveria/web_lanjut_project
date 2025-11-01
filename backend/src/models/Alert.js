const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  plantProfileId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be null for system alerts not tied to specific plants
    references: {
      model: 'plant_profiles',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false // e.g., 'temperature', 'ph', 'tds', 'humidity', 'system'
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  parameterName: {
    type: DataTypes.STRING, // e.g., 'temperature', 'ph', 'tds'
    allowNull: true
  },
  currentValue: {
    type: DataTypes.FLOAT, // actual value that triggered the alert
    allowNull: true
  },
  thresholdValue: {
    type: DataTypes.FLOAT, // threshold that was exceeded
    allowNull: true
  },
  actionRequired: {
    type: DataTypes.TEXT, // recommended action to resolve the alert
    allowNull: true
  },
  isResolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolvedBy: {
    type: DataTypes.INTEGER, // userId who resolved the alert
    allowNull: true
  },
  sensorDataId: {
    type: DataTypes.INTEGER, // reference to sensor data that triggered the alert
    allowNull: true
  }
}, {
  tableName: 'alerts',
  timestamps: true
});

module.exports = Alert;