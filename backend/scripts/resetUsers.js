/**
 * resetUsers.js - Wipes all users and seeds a fresh Admin account.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User.model');

const ADMIN = {
  name: 'System Admin',
  email: 'admin@rms.edu',
  password: 'Admin@123',
  role: 'admin',
  dept: 'Administration',
  status: 'Active',
  joined: new Date().toISOString().slice(0, 10)
};

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.');

  const deleted = await User.deleteMany({});
  console.log('Deleted ' + deleted.deletedCount + ' existing user(s).');

  const admin = await User.create(ADMIN);
  console.log('');
  console.log('=== FRESH ADMIN CREATED ===');
  console.log('Email    : ' + ADMIN.email);
  console.log('Password : ' + ADMIN.password);
  console.log('Role     : ' + admin.role);
  console.log('===========================');
  console.log('Done! Login at http://localhost:5173');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
