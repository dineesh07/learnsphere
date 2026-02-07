const User = require('../models/User');

// @desc    Get all instructors
// @route   GET /api/v1/users/instructors
// @access  Private (Instructor/Admin)
exports.getInstructors = async (req, res, next) => {
    try {
        const instructors = await User.find({
            role: { $in: ['instructor', 'admin'] }
        }).select('name email role');

        res.status(200).json({
            success: true,
            count: instructors.length,
            data: instructors
        });
    } catch (error) {
        next(error);
    }
};
