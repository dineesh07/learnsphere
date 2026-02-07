const express = require('express');
const {
    getLessons,
    getLesson,
    addLesson,
    updateLesson,
    deleteLesson,
    uploadLessonFile
} = require('../controllers/lesson');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router
    .route('/')
    .get(getLessons)
    .post(protect, authorize('instructor', 'admin'), addLesson);

router
    .route('/:id')
    .get(getLesson)
    .put(protect, authorize('instructor', 'admin'), updateLesson)
    .delete(protect, authorize('instructor', 'admin'), deleteLesson);

router.route('/:id/file').put(protect, authorize('instructor', 'admin'), upload.single('file'), uploadLessonFile);

module.exports = router;
