import mongoose from 'mongoose';

// u7r7WRCQkIVX2we0

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/abandoned-cart';

    await mongoose.connect(mongoUri);

    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.warn('⚠️ MongoDB Connection Failed (continuing in demo mode):', (error as any).message);
    console.log('💡 To enable full functionality, set MONGODB_URI environment variable');
    // Don't exit - allow app to run in demo mode
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB Disconnected');
  } catch (error) {
    console.error('❌ MongoDB Disconnection Failed:', error);
  }
};
