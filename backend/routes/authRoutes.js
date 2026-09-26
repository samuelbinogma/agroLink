/**
 * routes/authRoutes.js — URL -> handler mapping + validation rules.
 *
 * express-validator runs declared rules, then the validate middleware
 * (middleware/validate.js) returns 400 with all errors if anything fails.
 */
const express = require('express');
const { body } = require('express-validator');

const {
  registerUser,
  requestOtp,
  verifyOtp,
  loginUser,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    // body('field') targets one field; body() without a field validates the
    // WHOLE body, which we use for the "must provide email OR phone" rule.
    body()
      .custom((_, { req }) => req.body.email || req.body.phone)
      .withMessage('Provide at least an email or a phone number'),
    body('name')
      .isString()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),
    body('role')
      .isIn(['farmer', 'customer'])
      .withMessage('Role must be farmer or customer'),
    body('email')
      .optional({ values: 'falsy' })
      .isEmail()
      .normalizeEmail()
      .withMessage('Provide a valid email'),
    body('phone')
      .optional({ values: 'falsy' })
      .matches(/^[0-9+\- ]{7,15}$/)
      .withMessage('Provide a valid phone number'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  registerUser
);

router.post(
  '/request-otp',
  [body('contact').isString().notEmpty().withMessage('Contact is required')],
  validate,
  requestOtp
);

router.post(
  '/verify-otp',
  [
    body('contact').isString().notEmpty().withMessage('Contact is required'),
    body('otp')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('OTP must be a 6-digit code'),
  ],
  validate,
  verifyOtp
);

router.post(
  '/login',
  [
    body('contact').isString().notEmpty().withMessage('Contact is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
  ],
  validate,
  loginUser
);

// /me is private: protect() runs first and attaches req.user.
router.get('/me', protect, getMe);

module.exports = router;