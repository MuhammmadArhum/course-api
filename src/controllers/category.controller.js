const Category = require('../models/Category');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/categories
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json({ success: true, message: 'Category created', data: category });
});

// GET /api/categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: categories.length, data: categories });
});

// GET /api/categories/:id
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);
  res.status(200).json({ success: true, data: category });
});

// PUT /api/categories/:id
exports.updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true, runValidators: true }
  );
  if (!category) throw new AppError('Category not found', 404);
  res.status(200).json({ success: true, message: 'Category updated', data: category });
});

// DELETE /api/categories/:id
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);

  const inUse = await Course.exists({ category: category._id });
  if (inUse) throw new AppError('Cannot delete a category that still has courses', 400);

  await category.deleteOne();
  res.status(200).json({ success: true, message: 'Category deleted' });
});
