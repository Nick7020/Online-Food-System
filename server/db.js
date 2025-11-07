const mongoose = require('mongoose');
const colors = require('colors');

// Connection status tracking
let isConnected = false;
let retryCount = 0;
const maxRetries = 5; // Increased max retries
const retryDelay = 3000; // 3 seconds between retries

// Connection events
mongoose.connection.on('connecting', () => {
  console.log('MongoDB: Connecting...'.yellow);});

mongoose.connection.on('connected', () => {
  isConnected = true;
  retryCount = 0; // Reset retry count on successful connection
  console.log('MongoDB: Connected successfully'.green.bold);
  console.log(`MongoDB Host: ${mongoose.connection.host}`.cyan);
  console.log(`MongoDB Database: ${mongoose.connection.name}`.cyan);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB: Connection error:'.red, err.message);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('MongoDB: Disconnected'.yellow);
});

// Handle process termination
const gracefulExit = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB: Connection closed through app termination'.red);
    process.exit(0);
  } catch (err) {
    console.error('MongoDB: Error during disconnection:'.red, err);
    process.exit(1);
  }
};

// Listen for process termination
process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);

const connectDB = async () => {
  // Skip if already connected
  if (isConnected) {
    console.log('MongoDB: Using existing database connection'.yellow);
    return mongoose.connection;
  }

  console.log('MongoDB: Attempting to connect...'.yellow);
  
  try {
    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    // Add debug logging in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        console.log(`MongoDB: ${collectionName}.${method}`, JSON.stringify(query), doc);
      });
    }

    await mongoose.connect(process.env.MONGODB_URI, options);
    
    // Connection is now handled by the event listeners
    return mongoose.connection;
  } catch (error) {
    retryCount++;
    const errorMessage = `MongoDB: Connection attempt ${retryCount}/${maxRetries} failed: ${error.message}`;
    
    if (retryCount < maxRetries) {
      console.error(errorMessage.red);
      console.log(`Retrying in ${retryDelay/1000} seconds...`.yellow);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return connectDB();
    } else {
      console.error('MongoDB: Max retries reached. Please check:'.red.bold);
      console.error('1. Is MongoDB running?'.red);
      console.error('2. Is the connection string correct?'.red);
      console.error('3. Are there any network/firewall issues?'.red);
      console.error('Error details:'.red, error);
      
      // Don't exit in production, let the process manager handle it
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
      throw error;
    }
  }
};

// Export the connection function and connection status
module.exports = {
  connectDB,
  isConnected: () => isConnected,
  getConnection: () => mongoose.connection,
};
