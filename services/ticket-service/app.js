// ticket-service/app.js
const express = require('express');
const { sequelize, testConnection, syncModels } = require('./src/config/db');

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ticket-service' });
});

// Start server function
const startServer = async () => {
  try {
    // Test the connection using the exported function
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    // Sync models
    await syncModels();
    
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`🚀 Ticket service running on port ${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Run it
startServer();