const express = require('express');
const { register, login, getMe } = require('../controllers/auth');
const { getInstructors } = require('../controllers/user');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/instructors', protect, authorize('instructor', 'admin'), getInstructors);

module.exports = router;
