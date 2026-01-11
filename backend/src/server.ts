import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { initializeAbandonedCartCron } from './services/cronService';
import { errorHandler } from './middleware/auth';

// Routes
import userRoutes from './routes/users';
import cartRoutes from './routes/carts';
import notificationRoutes from './routes/notifications';
import productRoutes from './routes/products';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection and server startup
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log('\n');
      console.log('╔════════════════════════════════════════════╗');
      console.log('║ 🛒 Abandoned Cart Service - Backend        ║');
      console.log(`║ ✅ Server running on port ${PORT}            ║`);
      console.log(`║ 🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}  ║`);
      console.log('╚════════════════════════════════════════════╝');
      console.log('\n');
    });

    // Initialize cron job for abandoned cart notifications
    initializeAbandonedCartCron();

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
