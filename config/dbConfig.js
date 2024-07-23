import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.err(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

export default connectMongoDB;
