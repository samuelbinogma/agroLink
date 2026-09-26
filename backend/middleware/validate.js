/**
 * middleware/validate.js — runs express-validator rules declared in the route.
 * If any rule failed, we stop here with a 400 + the list of errors,
 * so controllers never write validation logic themselves.
 */
const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = validate;