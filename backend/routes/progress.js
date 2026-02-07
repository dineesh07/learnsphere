const express = require('express');
const {
    getProgress,
    updateProgress
} = require('../controllers/progress');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getProgress);
router.route('/lesson/:lessonId').put(updateProgress);

module.exports = router;
