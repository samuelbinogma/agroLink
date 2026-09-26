/**
 * controllers/authController.js — all /api/auth login.
 *
 * AUTH FLOW (why it looks this way)
 *   1. register   -> create account + auto-send OTP (isVerified stays false)
 *   2. verify-otp -> correct code flips isVerified to true and returns a JWT
 *   3. login      -> contact + password, ONLY allowed once verified
 *
 * Keeping register and verify as two steps means a random person can't spam
 * accounts: they need access to the email/phone to activate them.
 */

const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const {
  generateOtp,
  hashOtp,
  isValidOtp,
  sendOtp,
  OTP_EXPIRY_MINUTES,
} = require('../utils/otp');

/**
 * Pick only the fields a client should ever see.
 * (password has select:false already, and we drop the otp sub-doc here.)
 */
const toUser = (user) => ({
  id: user._id,
  name: user.name,
  role: user.role,
  email: user.email || null,
  phone: user.phone || null,
  isVerified: user.isVerified,
});

/** "sam@x.com" is an email, otherwise we treat the value as a phone. */
const isEmail = (contact) => contact.includes('@');

/** Builds { email?, phone? } from one "contact" string. */
const contactFilter = (contact) =>
  isEmail(contact) ? { email: contact.toLowerCase() } : { phone: contact };

/** Fresh OTP saved onto a user document + delivered. Shared by register/request-otp. */
async function issueOtp(user, contact) {
  const otp = generateOtp();
  user.otp = {
    codeHash: hashOtp(otp),
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  };
  await user.save();
  sendOtp(contact, otp);
}

/** Allow one contact via { email } or { phone }; helpers above fold them in. */
// @route  POST /api/auth/register
// @desc   Create an account and send the verification OTP
// @access Public
async function registerUser(req, res) {
  const { name, role, email, phone, password } = req.body;

  // Do not silently overwrite an existing account.
  // NOTE: { email: undefined } would match ANY document missing that field,
  // so we only include a filter for the fields the user actually sent.
  const match = [];
  if (email) match.push({ email: email.toLowerCase() });
  if (phone) match.push({ phone });

  const exists = match.length ? await User.findOne({ $or: match }) : null;
  if (exists) {
    const conflict = exists.email === email?.toLowerCase() ? 'email' : 'phone';
    return res.status(400).json({ message: `Account with that ${conflict} already exists` });
  }

  let user;
  try {
    user = await User.create({ name, role, email, phone, password });
  } catch (error) {
    // Rare duplicate-key race if two requests arrive at once.
    if (error.code === 11000) {
      return res.status(400).json({ message: 'That email or phone is already registered' });
    }
    throw error;
  }

  const contact = email || phone;
  await issueOtp(user, contact);

  res.status(201).json({
    message: `Account created. Enter the OTP sent to your ${isEmail(contact) ? 'email' : 'phone'}.`,
    via: isEmail(contact) ? 'email' : 'phone',
  });
}

// @route  POST /api/auth/request-otp
// @desc   Resend a fresh OTP (codes expire in 10 minutes)
// @access Public
async function requestOtp(req, res) {
  const { contact } = req.body;

  const user = await User.findOne(contactFilter(contact));
  if (!user) {
    return res.status(404).json({ message: 'No account found for that email or phone' });
  }

  await issueOtp(user, contact);
  res.json({ message: `A new OTP was sent to your ${isEmail(contact) ? 'email' : 'phone'}.` });
}

// @route  POST /api/auth/verify-otp
// @desc   Check the code, activate the account, return JWT
// @access Public
async function verifyOtp(req, res) {
  const { contact, otp } = req.body;

  const user = await User.findOne(contactFilter(contact));
  if (!user) {
    return res.status(404).json({ message: 'No account found for that email or phone' });
  }

  // Expiry check: expired code clears so it can't be replayed later.
  if (!user.otp || !user.otp.expiresAt || user.otp.expiresAt < new Date()) {
    return res.status(400).json({ message: 'OTP expired. Request a new one.' });
  }

  if (!isValidOtp(otp, user.otp.codeHash)) {
    return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
  }

  // Success: activate account, wipe the used code.
  user.isVerified = true;
  user.otp = undefined;
  await user.save();

  res.json({
    message: 'Account verified. Welcome to AgroLink!',
    token: generateToken(user),
    user: toUser(user),
  });
}

// @route  POST /api/auth/login
// @desc   Contact + password login (verified accounts only)
// @access Public
async function loginUser(req, res) {
  const { contact, password } = req.body;

  // select:false on password -> must explicitly ask for it here.
  const user = await User.findOne(contactFilter(contact)).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid email/phone or password' });
  }

  const passwordOk = await user.matchPassword(password);
  if (!passwordOk) {
    return res.status(401).json({ message: 'Invalid email/phone or password' });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      message: 'Account not verified yet. Please enter the OTP we sent you.',
    });
  }

  res.json({
    message: 'Logged in successfully.',
    token: generateToken(user),
    user: toUser(user),
  });
}

// @route  GET /api/auth/me
// @desc   Return the currently logged-in user (from the JWT)
// @access Private (protect middleware)
async function getMe(req, res) {
  res.json({ user: toUser(req.user) });
}

module.exports = { registerUser, requestOtp, verifyOtp, loginUser, getMe };