const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    shortDescription: {
        type: String,
        maxLength: 150
    },
    image: {
        type: String,
        default: 'no-photo.jpg',
    },
    tags: [String],
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS',
        ],
    },
    published: {
        type: Boolean,
        default: false,
    },
    visibility: {
        type: String,
        enum: ['everyone', 'signedin'],
        default: 'everyone',
    },
    accessRule: {
        type: String,
        enum: ['open', 'invitation', 'payment'],
        default: 'open',
    },
    price: {
        type: Number,
        // required only if accessRule is payment, handled in validation later or UI
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    responsibleUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        // Optional - defaults to instructor if not set
    },
    lessonsCount: {
        type: Number,
        default: 0
    },
    totalDuration: {
        type: Number, // in minutes
        default: 0
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must can not be more than 5'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Cascade delete lessons when a course is deleted
CourseSchema.pre('remove', async function (next) {
    console.log(`Lessons being removed from course ${this._id}`);
    await this.model('Lesson').deleteMany({ course: this._id });
    next();
});

// Reverse populate with virtuals
CourseSchema.virtual('lessons', {
    ref: 'Lesson',
    localField: '_id',
    foreignField: 'course',
    justOne: false
});

// Reverse populate quizzes
CourseSchema.virtual('quizzes', {
    ref: 'Quiz',
    localField: '_id',
    foreignField: 'course',
    justOne: false
});

module.exports = mongoose.model('Course', CourseSchema);
