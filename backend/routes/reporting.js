const express = require('express');
const {
    getInstructorStats,
    getCourseProgressReport
} = require('../controllers/reporting');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('instructor', 'admin'));

router.get('/instructor', getInstructorStats);
router.get('/course/:courseId', getCourseProgressReport);

module.exports = router;
