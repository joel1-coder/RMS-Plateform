const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    plainPassword: { type: String, select: false }, // Admin-visible plain text copy
    role: {
      type: String,
      required: true,
      enum: ['admin', 'supervisor', 'scholar', 'hod', 'drc', 'principal']
    },
    dept: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    joined: { type: String, required: true },
    assignedSupervisor: { type: String, trim: true },
    assignedSupervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isProfileCompleted: { type: Boolean, default: false },
    profile: {
      regNo: { type: String, trim: true },
      phone: { type: String, trim: true },
      batch: { type: String, trim: true },
      category: { type: String, trim: true },
      area: { type: String, trim: true },
      address: { type: String, trim: true },
      dob: { type: String, trim: true },
      gender: { type: String, trim: true },
      nationality: { type: String, trim: true },
      aadhaar: { type: String, trim: true },
      qualification: { type: String, trim: true },
      experience: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });
userSchema.index({ assignedSupervisorId: 1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }
  // Store the plain-text password for admin display before hashing
  this.plainPassword = this.password;
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

/**
 * Compares a plaintext password with the stored hash.
 * @param {string} candidatePassword Plaintext candidate password.
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Returns a public user object with an `id` field and no password.
 * @returns {object}
 */
userSchema.methods.toPublicJSON = function toPublicJSON({ includePassword = false } = {}) {
  const user = this.toObject({ versionKey: false });
  user.id = user._id;
  delete user._id;
  delete user.password;
  delete user.__v;
  if (!includePassword) {
    delete user.plainPassword;
  }
  return user;
};

module.exports = mongoose.model('User', userSchema, 'users');
