// user-service/src/config/database.js
const { Sequelize } = require('sequelize');

// Sequelize requires the mysql2 package to communicate with MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'helpdesk_user_db',
  process.env.DB_USER || 'helpdesk_user',
  process.env.DB_PASSWORD || 'helpdesk_pass',
  {
    host: process.env.DB_HOST || 'mysql',
    dialect: 'mysql',
    port: 3306,
    logging: false,
  }
);

module.exports = sequelize;

