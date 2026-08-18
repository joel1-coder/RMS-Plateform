require('dotenv').config();

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const User = require('../models/User.model');
const ResearchProject = require('../models/ResearchProject.model');
const Meeting = require('../models/Meeting.model');
const SystemSetting = require('../models/SystemSetting.model');

const passwordByEmail = {
  'admin@rms.edu': 'admin123',
  'supervisor@rms.edu': 'super123',
  'scholar@rms.edu': 'scholar123',
  'hod@rms.edu': 'hod123',
  'drc@rms.edu': 'drc123'
};

function seedPath() {
  return path.resolve(__dirname, '..', '..', '..', 'analysis', 'seed-data.json');
}

function readSeedData() {
  return JSON.parse(fs.readFileSync(seedPath(), 'utf8'));
}

async function upsertUsers(users) {
  for (const user of users) {
    const { _id, ...fields } = user;
    const password = passwordByEmail[user.email] || user.password;
    const hashedPassword = password.startsWith('$2') ? password : await bcrypt.hash(password, 10);
    await User.updateOne(
      { email: user.email },
      { $set: { ...fields, password: hashedPassword }, $setOnInsert: { _id } },
      { upsert: true, runValidators: true }
    );
  }
}

async function upsertById(Model, records) {
  for (const record of records) {
    const { _id, ...fields } = record;
    await Model.updateOne(
      { _id },
      { $set: fields, $setOnInsert: { _id } },
      { upsert: true, runValidators: true }
    );
  }
}

async function seed() {
  const data = readSeedData();
  await connectDB(process.env.MONGO_URI);
  await upsertUsers(data.users || []);
  await upsertById(ResearchProject, data.research_projects || []);
  await upsertById(Meeting, data.meetings || []);

  if (data.system_settings) {
    await SystemSetting.updateOne(
      { uniCode: data.system_settings.uniCode },
      { $set: data.system_settings },
      { upsert: true, runValidators: true }
    );
  }

  console.log('Seed completed successfully');
}

seed()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
