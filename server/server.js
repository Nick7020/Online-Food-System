require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const colors = require('colors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

// Import database connection
const { connectDB, isConnected, getConnection } = require('./db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize express app
const app = express();

// 1) GLOBAL MIDDLEWARES

// Enable CORS with specific origin
const corsOptions = {
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // 100 requests per window
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
  ]
}));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// 3) ERROR HANDLING
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// 4) START SERVER
const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  
  try {
    console.log('🔄 Starting server initialization...'.yellow);
    
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...'.yellow);
    await connectDB();
    
    // Verify MongoDB connection
    if (!isConnected()) {
      throw new Error('Failed to connect to MongoDB');
    }
    
    // Start the server after successful DB connection
    const server = app.listen(PORT, () => {
      console.log(`\n✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.cyan.underline);
      console.log(`🌐 MongoDB Status: ${isConnected() ? 'Connected'.green : 'Disconnected'.red}`);
      if (isConnected()) {
        console.log(`📊 MongoDB Database: ${getConnection().name}`.cyan);
      }
      console.log(`🕒 Server Time: ${new Date().toISOString()}`.gray);
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...'.red);
      console.error(err.name, err.message);
      
      // Gracefully close server
      server.close(() => {
        console.log('💥 Process terminated!'.red.bold);
        process.exit(1);
      });
    });
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...'.red);
      console.error(err.name, err.message);
      
      // Gracefully close server
      server.close(() => {
        console.log('💥 Process terminated!'.red.bold);
        process.exit(1);
      });
    });
    
    // Handle SIGTERM for production
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully'.yellow);
      server.close(() => {
        console.log('💥 Process terminated!'.red.bold);
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:'.red, error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });
}

// Start the server
startServer();

// Export the app for testing
module.exports = app;
