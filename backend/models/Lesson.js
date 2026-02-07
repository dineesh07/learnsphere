const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a lesson title'],
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
    },
    type: {
        type: String,
        enum: ['video', 'document', 'image', 'quiz'],
        required: true,
    },
    description: {
        type: String,
    },
    // Video fields
    videoUrl: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid video URL',
        ]
    },
    duration: {
        type: Number, // seconds or minutes
        default: 0
    },
    // Document/Image fields
    fileUrl: {
        type: String
    },
    allowDownload: {
        type: Boolean,
        default: true
    },
    // Order in the course
    order: {
        type: Number,
        default: 0
    },
    responsiblePerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    additionalAttachments: [{
        name: String,
        url: String,
        type: String,
        size: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Calculate course total duration or lesson count after save
LessonSchema.post('save', async function () {
    await this.model('Course').findByIdAndUpdate(this.course, {
        $inc: { lessonsCount: 1 } // Simplified logic
    });
});

module.exports = mongoose.model('Lesson', LessonSchema);
