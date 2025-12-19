// Helper script to check and fix MongoDB connection
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const fixConnection = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    console.log('Original URI:', mongoUri);
    
    // Add database name if not present
    if (!mongoUri.includes('/bookmyshow')) {
      if (mongoUri.includes('/?')) {
        mongoUri = mongoUri.replace('/?', '/bookmyshow?');
      } else if (mongoUri.includes('?')) {
        mongoUri = mongoUri.replace('?', '/bookmyshow?');
      } else {
        mongoUri = mongoUri.replace(/\/$/, '') + '/bookmyshow';
      }
    }
    
    console.log('Fixed URI:', mongoUri);
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ Connected to database: ${conn.connection.name}`);
    console.log(`   Host: ${conn.connection.host}`);
    
    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`\n📁 Collections in database:`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixConnection();

