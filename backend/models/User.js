const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validatePassword } = require('../utils/passwordValidator');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ['learner', 'instructor', 'admin'],
        default: 'learner',
    },
    // Track which admin created this instructor account
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: function () {
            return this.role === 'instructor';
        }
    },
    // Approval status for instructors
    isApproved: {
        type: Boolean,
        default: function () {
            return this.role !== 'instructor'; // Auto-approve learners and admins
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // For learners: total points and badge level
    points: {
        type: Number,
        default: 0
    },
    badge: {
        type: String,
        enum: ['Newbie', 'Explorer', 'Achiever', 'Specialist', 'Expert', 'Master'],
        default: 'Newbie'
    }
});

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    // Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate badge based on points
UserSchema.methods.calculateBadge = function () {
    const points = this.points;
    if (points >= 120) return 'Master';
    if (points >= 100) return 'Expert';
    if (points >= 80) return 'Specialist';
    if (points >= 60) return 'Achiever';
    if (points >= 40) return 'Explorer';
    if (points >= 20) return 'Newbie';
    return 'Newbie';
};

module.exports = mongoose.model('User', UserSchema);
