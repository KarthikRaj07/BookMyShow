const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Ensure database name is in the connection string
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    // If database name is not in URI, add it
    if (!mongoUri.includes('/bookmyshow')) {
      if (mongoUri.includes('/?')) {
        mongoUri = mongoUri.replace('/?', '/bookmyshow?');
      } else if (mongoUri.includes('?')) {
        mongoUri = mongoUri.replace('?', '/bookmyshow?');
      } else {
        mongoUri = mongoUri.replace(/\/$/, '') + '/bookmyshow';
      }
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

