const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check password here so we hash only valid input (other fields validated by the model)
  if (!password) throw new AppError('Password is required', 400);
  if (password.length < 6) throw new AppError('Password must be at least 6 characters', 400);

  const exists = await User.findOne({ email: (email || '').toLowerCase() });
  if (exists) throw new AppError('Email already registered', 400);

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { id: user._id, name: user.name, email: user.email },
  });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Email and password are required', 400);

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: signToken(user._id),
    data: { id: user._id, name: user.name, email: user.email },
  });
});

// GET /api/auth/me  (protected)
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
});
