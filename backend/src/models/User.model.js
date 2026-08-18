const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'supervisor', 'scholar', 'hod', 'drc', 'librarian']
    },
    dept: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    joined: { type: String, required: true },
    assignedSupervisor: { type: String, trim: true },
    assignedSupervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });
userSchema.index({ assignedSupervisorId: 1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

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
userSchema.methods.toPublicJSON = function toPublicJSON() {
  const user = this.toObject();
  user.id = user._id;
  delete user._id;
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema, 'users');
