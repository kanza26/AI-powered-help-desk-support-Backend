const Sequelize  = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ticket_system',
  process.env.DB_USER || 'ticket_user',
  process.env.DB_PASSWORD || 'ticket_pass',
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to MySQL:', error.message);
    return false;
  }
};

// Sync models (optional)
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: false }); // Set alter: true only in development
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = { sequelize, testConnection, syncModels };

