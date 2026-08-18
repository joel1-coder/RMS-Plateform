const mongoose = require('mongoose');

/**
 * Connects Mongoose to MongoDB.
 * @param {string} mongoUri MongoDB connection string.
 * @returns {Promise<typeof mongoose>}
 */
async function connectDB(mongoUri = process.env.MONGO_URI) {
  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  return mongoose;
}

module.exports = { connectDB };
