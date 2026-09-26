/**
 * middleware/authMiddleware.js — "protect" guard for protected routes.
 *
 * Flow:
 *   1. Read `Authorization: Bearer <token>` from the request header.
 *   2. Verify the token signature + expiry with our secret.
 *   3. Load the user from the id inside the token and attach to req.user,
 *      so the route handler can use req.user without another lookup.
 *   4. On any failure -> 401 (Unauthorized).
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  let token;

  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Re-fetch the user so a deleted/disabled account instantly loses access.
    const user = await User.findById(decoded.id).select('-otp');
    if (!user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
}

module.exports = { protect };