/**
 * utils/generateToken.js — issues a JWT for an authenticated user.
 *
 * HOW JWT WORKS (briefly)
 *   The server signs a small JSON payload with our secret. The resulting
 *   token travels with every request as `Authorization: Bearer <token>`.
 *   Because we hold the secret, we can VERIFY that the token was really
 *   issued by us and hasn't been tampered with — this is what lets us skip
 *   server-side session storage.
 *
 * Payload here: user id + role. `role` lets middleware check permissions
 * WITHOUT a database hit in Feature 3 (role-based access).
 */
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

module.exports = generateToken;