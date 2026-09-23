/**
 * db.js — MongoDB connection
 *
 * We keep the database connection in its own file so that:
 *   1. server.js stays clean and just "boots" the app.
 *   2. Any future file (models, seed scripts) can reuse the same connection.
 *
 * We use Mongoose, a popular "ODM" (Object Document Mapper).
 * ODM = a layer that lets us talk to MongoDB using JavaScript objects
 * instead of raw database queries, and it gives us schemas (structure)
 * for our data — we'll see those in Feature 2 (User model).
 */
const mongoose = require('mongoose');

/**
 * connectDB()
 *  - Reads the connection string from the .env file.
 *  - Tries to connect.
 *  - Logs success or a clear error so we can see what went wrong.
 *
 * Returns the mongoose connection (or throws on failure — server.js
 * will catch it so the server doesn't run half-connected).
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process with a failure code (1) so we know boot failed.
    process.exit(1);
  }
};

module.exports = connectDB;