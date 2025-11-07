require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    
    // Check if we can access the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Collections in database:');
    console.log(collections.map(c => c.name).join(', ') || 'No collections found');
    
    // Try to insert a test document
    const Test = mongoose.model('Test', new mongoose.Schema({ name: String }));
    const testDoc = await Test.create({ name: 'Test Document' });
    console.log('✅ Test document created:', testDoc);
    
    // Find the test document
    const foundDoc = await Test.findById(testDoc._id);
    console.log('🔍 Found test document:', foundDoc);
    
    // Clean up
    await Test.deleteOne({ _id: testDoc._id });
    console.log('🧹 Cleaned up test document');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

testConnection();
