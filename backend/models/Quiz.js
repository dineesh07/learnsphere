const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a quiz title'],
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
    },
    // A quiz can be linked to a lesson type 'quiz' or be standalone
    lesson: {
        type: mongoose.Schema.ObjectId,
        ref: 'Lesson',
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        options: [{
            text: { type: String, required: true },
            isCorrect: { type: Boolean, required: true, default: false }
        }],
        points: {
            type: Number,
            default: 1
        }
    }],
    rewards: {
        firstAttempt: { type: Number, default: 10 },
        secondAttempt: { type: Number, default: 5 },
        thirdAttempt: { type: Number, default: 2 },
        moreAttempts: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Quiz', QuizSchema);
