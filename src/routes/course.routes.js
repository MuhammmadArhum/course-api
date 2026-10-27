const router = require('express').Router();
const c = require('../controllers/course.controller');
const { protect } = require('../middleware/auth');

router.route('/').get(c.getCourses).post(protect, c.createCourse);
router.route('/:id').get(c.getCourse).put(protect, c.updateCourse).delete(protect, c.deleteCourse);

module.exports = router;
