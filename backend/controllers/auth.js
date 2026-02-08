const User = require('../models/User');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Prevent instructor registration via public route
        // Instructors can only be created by admins
        if (role === 'instructor') {
            return res.status(403).json({
                success: false,
                error: 'Instructor accounts can only be created by administrators'
            });
        }

        // Create user (learner only through this route)
        const user = await User.create({
            name,
            email,
            password,
            role: role === 'admin' ? 'admin' : 'learner', // Prevent admin self-registration in production
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        // Handle validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if instructor account is approved
        if (user.role === 'instructor' && !user.isApproved) {
            return res.status(403).json({
                success: false,
                error: 'Your instructor account is pending approval. Please contact an administrator.'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_EXPIRE.match(/(\d+)/)[0] * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options) // Optional: also send cookie
        .json({
            success: true,
            token,
            data: {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                points: user.points,
                badge: user.badge
            }
        });
};

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({ success: false, error: 'Password is incorrect' });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

