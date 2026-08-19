const mongoose = require('mongoose');
const dns = require('dns');

/**
 * Connects Mongoose to MongoDB.
 * Override DNS to use Google public DNS so the mongodb+srv SRV record
 * resolves correctly in environments with restrictive corporate DNS.
 * @param {string} mongoUri MongoDB connection string.
 * @returns {Promise<typeof mongoose>}
 */
async function connectDB(mongoUri = process.env.MONGO_URI) {
  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  // Force Node.js DNS to use Google's public DNS for SRV record resolution
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch (e) {
    // dns.setServers may throw if already set; safe to ignore
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });
  return mongoose;
}

module.exports = { connectDB };
