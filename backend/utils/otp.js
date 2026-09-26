/**
 * utils/otp.js — one-time passcode helpers.
 *
 * CONCEPTS
 *  - We store a HASH of the OTP, not the OTP itself. If the database leaks,
 *    an attacker cannot read valid codes (or reuse them for other users).
 *    SHA-256 is fine here because codes are short-lived and low-value.
 *  - crypto.randomInt is cryptographically secure — never use Math.random()
 *    for security-sensitive codes.
 */

const crypto = require('crypto');

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

/** Generate a 6-digit numeric code as a string ("042301"). */
function generateOtp() {
  return crypto.randomInt(0, 1000000).toString().padStart(OTP_LENGTH, '0');
}

/** One-way hash of the code (what we save to MongoDB). */
function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

/** Constant-time-ish comparison of the user's input against the stored hash. */
function isValidOtp(otp, storedHash) {
  if (!storedHash) return false;
  return hashOtp(otp) === storedHash;
}

/**
 * Deliver the OTP to the user.
 *
 * DEV ONLY: we print it in the server console so you can test without
 * a provider. In production, swap the console.log for:
 *   - email  -> nodemailer / SendGrid / Resend
 *   - SMS    -> Twilio / Firebase Auth / Africa's Talking
 */
function sendOtp(contact, otp) {
  const channel = contact.includes('@') ? 'email' : 'phone';
  console.log(`\n[DEV-OTP] -> ${channel}: ${contact}\n[DEV-OTP] -> your code: ${otp}\n`);
}

module.exports = { generateOtp, hashOtp, isValidOtp, sendOtp, OTP_EXPIRY_MINUTES };