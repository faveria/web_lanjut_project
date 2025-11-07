const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SensorData = sequelize.define('SensorData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  suhu_air: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  suhu_udara: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  kelembapan: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  tds: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ph: {
    type: DataTypes.FLOAT,
    allowNull: true  // pH can be null if sensor is not available
  },
  pompa: {
    type: DataTypes.STRING,  // ON/OFF status
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sensor_data',
  timestamps: false
});

module.exports = SensorData;