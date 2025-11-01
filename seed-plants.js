const { sequelize } = require('./backend/src/models');
const seedPlants = require('./backend/src/seeders/plantSeeder');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding process...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Run plant seeder
    await seedPlants();
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Close connection
    await sequelize.close();
    console.log('🔒 Database connection closed');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

// Run the seeding process
seedDatabase();