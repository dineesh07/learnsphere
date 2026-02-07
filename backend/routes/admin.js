const express = require('express');
const {
    createInstructor,
    getInstructors,
    getInstructor,
    updateInstructor,
    deleteInstructor
} = require('../controllers/admin');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Test endpoint (remove after debugging)
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Admin routes are working!' });
});

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

router.route('/instructors')
    .post(createInstructor)
    .get(getInstructors);

router.route('/instructors/:id')
    .get(getInstructor)
    .put(updateInstructor)
    .delete(deleteInstructor);

module.exports = router;
