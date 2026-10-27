const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Protects routes: requires header  Authorization: Bearer <token>
exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    throw new AppError('Not authorized, token missing', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
  } catch (e) {
    throw new AppError('Not authorized, token invalid or expired', 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('Not authorized, user no longer exists', 401);

  req.user = user;
  next();
});
