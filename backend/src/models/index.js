const sequelize = require('../config/database');
const User = require('./User');
const SensorData = require('./SensorData');
const PlantProfile = require('./PlantProfile');
const UserPlantSetting = require('./UserPlantSetting');
const Alert = require('./Alert');

// Define associations
User.hasMany(UserPlantSetting, { foreignKey: 'userId' });
UserPlantSetting.belongsTo(User, { foreignKey: 'userId' });

PlantProfile.hasMany(UserPlantSetting, { foreignKey: 'plantProfileId' });
UserPlantSetting.belongsTo(PlantProfile, { foreignKey: 'plantProfileId' });

User.hasMany(Alert, { foreignKey: 'userId' });
Alert.belongsTo(User, { foreignKey: 'userId' });

PlantProfile.hasMany(Alert, { foreignKey: 'plantProfileId' });
Alert.belongsTo(PlantProfile, { foreignKey: 'plantProfileId' });

SensorData.hasMany(Alert, { foreignKey: 'sensorDataId' });
Alert.belongsTo(SensorData, { foreignKey: 'sensorDataId' });

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  SensorData,
  PlantProfile,
  UserPlantSetting,
  Alert,
  syncDatabase
};