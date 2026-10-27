const mongoose = require('mongoose');
const Course = require('../models/Course');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Make sure the supplied category id is valid and exists
const assertCategory = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError('Category not found', 404);
  const found = await Category.exists({ _id: id });
  if (!found) throw new AppError('Category not found', 404);
};

// POST /api/courses
exports.createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, duration, category } = req.body;

  // Required-field errors (title, description, price, category) are raised by the model as 400
  if (category) await assertCategory(category);

  const course = await Course.create({
    title,
    description,
    price,
    duration,
    category,
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, message: 'Course created', data: course });
});

// GET /api/courses   (optional filter: ?category=<id>)
exports.getCourses = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;

  const courses = await Course.find(filter).populate('category', 'name').sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: courses.length, data: courses });
});

// GET /api/courses/:id
exports.getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('category', 'name');
  if (!course) throw new AppError('Course not found', 404);
  res.status(200).json({ success: true, data: course });
});

// PUT /api/courses/:id
exports.updateCourse = asyncHandler(async (req, res) => {
  const { title, description, price, duration, category } = req.body;
  if (category) await assertCategory(category);

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { title, description, price, duration, category },
    { new: true, runValidators: true }
  );
  if (!course) throw new AppError('Course not found', 404);
  res.status(200).json({ success: true, message: 'Course updated', data: course });
});

// DELETE /api/courses/:id
exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) throw new AppError('Course not found', 404);
  res.status(200).json({ success: true, message: 'Course deleted' });
});
