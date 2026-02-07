const express = require('express');
const {
    getQuizzes,
    getQuiz,
    createQuiz,
    submitQuizAttempt,
    getMyAttempts
} = require('../controllers/quiz');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getQuizzes)
    .post(protect, authorize('instructor', 'admin'), createQuiz);

router
    .route('/:id')
    .get(getQuiz);

router.post('/:id/attempt', protect, submitQuizAttempt);
router.get('/:id/attempts', protect, getMyAttempts);

module.exports = router;
