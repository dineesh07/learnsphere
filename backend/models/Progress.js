const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
    },
    completedLessons: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Lesson'
    }],
    percentCompleted: {
        type: Number,
        default: 0
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    startedAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate percentage on save
ProgressSchema.pre('save', async function (next) {
    // Logic to calculate percentage will be handled in controller for now to avoid circular dependency complexity here
    next();
});

module.exports = mongoose.model('Progress', ProgressSchema);
