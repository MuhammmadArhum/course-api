const router = require('express').Router();
const c = require('../controllers/category.controller');
const { protect } = require('../middleware/auth');

router.route('/').get(c.getCategories).post(protect, c.createCategory);
router.route('/:id').get(c.getCategory).put(protect, c.updateCategory).delete(protect, c.deleteCategory);

module.exports = router;
