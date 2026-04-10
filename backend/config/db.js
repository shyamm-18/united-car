const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Add event listeners for better monitoring
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connection established successfully.');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    // We use 127.0.0.1 instead of localhost for Node > 17 compatibility
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car-rental';
    
    // Connect with timeout settings
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Try for 5 seconds before failing
    });
    
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed. Is MongoDB installed and running?`);
    console.error(`Error details: ${error.message}`);
    
    console.log('🔄 Retrying connection in 5 seconds...');
    // Retry connection without crashing the explicit process
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
