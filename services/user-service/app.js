// user-service/app.js
const express = require('express');
const sequelize = require('./src/config/db.js');

const app = express();
app.use(express.json());

// Your routes (example)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service' });
});

// Start server function
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected successfully');
    
    await sequelize.sync();
    console.log('✅ Database models synced');
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 User service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Run it
startServer();