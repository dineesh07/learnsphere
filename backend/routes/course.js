const express = require('express');
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadCoursePhoto,
    inviteUser
} = require('../controllers/course');

// Include other resource routers
const lessonRouter = require('./lesson');
const quizRouter = require('./quiz');
const reviewRouter = require('./review');
const progressRouter = require('./progress');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload'); // File upload middleware

// Re-route into other resource routers
router.use('/:courseId/lessons', lessonRouter);
router.use('/:courseId/quizzes', quizRouter);
router.use('/:courseId/reviews', reviewRouter);
router.use('/:courseId/progress', progressRouter);

router
    .route('/')
    .get(getCourses)
    .post(protect, authorize('instructor', 'admin'), createCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(protect, authorize('instructor', 'admin'), updateCourse)
    .delete(protect, authorize('instructor', 'admin'), deleteCourse);

router
    .put('/:id/photo', protect, authorize('instructor', 'admin'), upload.single('file'), uploadCoursePhoto);

router
    .route('/:id/invite')
    .post(protect, authorize('instructor', 'admin'), inviteUser);

module.exports = router;
