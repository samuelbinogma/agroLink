/**
 * models/User.js — the User document shape in MongoDB.
 *
 * KEY CONCEPTS
 *  - A Mongoose "schema" defines the fields a document can have.
 *  - A Mongoose "model" is the thing you query: User.find(), User.create()...
 *  - `email` and `phone` use `sparse: true`. Sparse unique index = MongoDB
 *    only enforces uniqueness on documents that HAVE the field. This lets a
 *    phone-only user have no email, and vice-versa, without violating the
 *    unique constraint.
 *  - `select: false` on password means it is NEVER returned by normal
 *    queries — a default security habit. We opt back in with .select('+password')
 *    only when logging in.
 *  - The `otp` sub-object holds the hashed one-time code + its expiry.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },

    // 'farmer' or 'customer' — set at signup, used for role-based access.
    role: {
      type: String,
      enum: ['farmer', 'customer'],
      default: 'customer',
    },

    // sparse unique: users may have email, phone, or both.
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      sparse: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\- ]{7,15}$/, 'Please provide a valid phone number'],
      sparse: true,
      unique: true,
    },

    // bcryptjs hashes the password in the pre('save') hook below.
    // The raw password is never stored.
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    // Account becomes true only after a successful OTP verification.
    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      codeHash: { type: String }, // SHA-256 of the 6-digit code
      expiresAt: { type: Date },  // when this code stops being valid
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

/**
 * pre('save') — runs BEFORE every save (create/update).
 * Hashes the password only when it actually changed, so we never
 * re-hash an already-hashed password on unrelated updates.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

/**
 * A helper attached to every user instance.
 * `await user.matchPassword(plainText)` -> true/false
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);