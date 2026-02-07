const User = require('../models/User');

// @desc    Create instructor account (Admin only)
// @route   POST /api/v1/admin/instructors
// @access  Private/Admin
exports.createInstructor = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide name, email, and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'A user with this email already exists'
            });
        }

        // Create instructor account
        const instructor = await User.create({
            name,
            email,
            password,
            role: 'instructor',
            createdBy: req.user.id,
            isApproved: true // Auto-approve when created by admin
        });

        res.status(201).json({
            success: true,
            data: {
                _id: instructor._id,
                name: instructor.name,
                email: instructor.email,
                role: instructor.role,
                isApproved: instructor.isApproved,
                createdAt: instructor.createdAt
            }
        });
    } catch (err) {
        // Handle validation errors (including password validation)
        console.error('Error creating instructor:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
        return res.status(500).json({
            success: false,
            error: err.message || 'Failed to create instructor'
        });
    }
};

// @desc    Get all instructors
// @route   GET /api/v1/admin/instructors
// @access  Private/Admin
exports.getInstructors = async (req, res, next) => {
    try {
        const instructors = await User.find({ role: 'instructor' })
            .populate('createdBy', 'name email')
            .select('-password')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: instructors.length,
            data: instructors
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single instructor
// @route   GET /api/v1/admin/instructors/:id
// @access  Private/Admin
exports.getInstructor = async (req, res, next) => {
    try {
        const instructor = await User.findById(req.params.id)
            .populate('createdBy', 'name email')
            .select('-password');

        if (!instructor || instructor.role !== 'instructor') {
            return res.status(404).json({
                success: false,
                error: 'Instructor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: instructor
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update instructor approval status
// @route   PUT /api/v1/admin/instructors/:id
// @access  Private/Admin
exports.updateInstructor = async (req, res, next) => {
    try {
        const { isApproved } = req.body;

        const instructor = await User.findById(req.params.id);

        if (!instructor || instructor.role !== 'instructor') {
            return res.status(404).json({
                success: false,
                error: 'Instructor not found'
            });
        }

        // Update approval status
        if (typeof isApproved !== 'undefined') {
            instructor.isApproved = isApproved;
            await instructor.save({ validateBeforeSave: false });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: instructor._id,
                name: instructor.name,
                email: instructor.email,
                isApproved: instructor.isApproved
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete instructor
// @route   DELETE /api/v1/admin/instructors/:id
// @access  Private/Admin
exports.deleteInstructor = async (req, res, next) => {
    try {
        const instructor = await User.findById(req.params.id);

        if (!instructor || instructor.role !== 'instructor') {
            return res.status(404).json({
                success: false,
                error: 'Instructor not found'
            });
        }

        await instructor.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
