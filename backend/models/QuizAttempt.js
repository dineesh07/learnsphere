const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    quiz: {
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    pointsEarned: {
        type: Number,
        required: true,
    },
    attemptNumber: {
        type: Number,
        required: true,
    },
    answers: [{
        questionId: mongoose.Schema.ObjectId,
        selectedOption: String
    }],
    completedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
