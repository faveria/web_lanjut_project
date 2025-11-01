const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PlantProfile = sequelize.define('PlantProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  scientificName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING, // e.g., 'leafy', 'fruit', 'herb'
    allowNull: true
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'moderate', 'difficult'),
    defaultValue: 'moderate'
  },
  growthTime: {
    type: DataTypes.INTEGER, // Days to harvest
    allowNull: true
  },
  optimalPhMin: {
    type: DataTypes.FLOAT,
    defaultValue: 5.5
  },
  optimalPhMax: {
    type: DataTypes.FLOAT,
    defaultValue: 6.5
  },
  optimalTdsMin: {
    type: DataTypes.INTEGER,
    defaultValue: 800
  },
  optimalTdsMax: {
    type: DataTypes.INTEGER,
    defaultValue: 1200
  },
  optimalWaterTempMin: {
    type: DataTypes.FLOAT,
    defaultValue: 18.0
  },
  optimalWaterTempMax: {
    type: DataTypes.FLOAT,
    defaultValue: 22.0
  },
  optimalAirTempMin: {
    type: DataTypes.FLOAT,
    defaultValue: 20.0
  },
  optimalAirTempMax: {
    type: DataTypes.FLOAT,
    defaultValue: 25.0
  },
  optimalHumidityMin: {
    type: DataTypes.FLOAT,
    defaultValue: 40.0
  },
  optimalHumidityMax: {
    type: DataTypes.FLOAT,
    defaultValue: 70.0
  },
  lightRequirements: {
    type: DataTypes.STRING, // e.g., 'full sun', 'partial shade'
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING, // URL to plant image
    allowNull: true
  },
  maintenanceLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'plant_profiles',
  timestamps: true
});

module.exports = PlantProfile;