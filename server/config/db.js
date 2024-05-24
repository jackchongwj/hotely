import mongoose from 'mongoose';

let db;

const connectDB = async () => {
  if (db) {
    console.log('Using existing database connection');
    return db;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = mongoose.connection;
    console.log('Database connected successfully.');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit process if the connection fails
  }
};

export default connectDB;
