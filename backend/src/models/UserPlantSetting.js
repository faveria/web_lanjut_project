const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPlantSetting = sequelize.define('UserPlantSetting', {
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
    allowNull: false,
    references: {
      model: 'plant_profiles',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  growthPhase: {
    type: DataTypes.ENUM('seedling', 'vegetative', 'flowering', 'harvest'),
    defaultValue: 'seedling'
  },
  plantedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expectedHarvestDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'user_plant_settings',
  timestamps: true
});

module.exports = UserPlantSetting;