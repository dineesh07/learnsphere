const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @desc    Get lessons
// @route   GET /api/v1/lessons
// @route   GET /api/v1/courses/:courseId/lessons
// @access  Public
exports.getLessons = async (req, res, next) => {
    try {
        let query;

        if (req.params.courseId) {
            query = Lesson.find({ course: req.params.courseId }).sort('order');
        } else {
            query = Lesson.find().populate({
                path: 'course',
                select: 'title description'
            });
        }

        const lessons = await query;

        res.status(200).json({
            success: true,
            count: lessons.length,
            data: lessons
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single lesson
// @route   GET /api/v1/lessons/:id
// @access  Public
exports.getLesson = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate({
            path: 'course',
            select: 'title description'
        });

        if (!lesson) {
            return res.status(404).json({ success: false, error: `Lesson not found with id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: lesson
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add lesson
// @route   POST /api/v1/courses/:courseId/lessons
// @access  Private (Instructor/Admin)
exports.addLesson = async (req, res, next) => {
    try {
        console.log('=== Add Lesson Debug ===');
        console.log('Course ID:', req.params.courseId);
        console.log('Request body:', req.body);

        req.body.course = req.params.courseId;

        const course = await Course.findById(req.params.courseId);

        if (!course) {
            console.error('Course not found:', req.params.courseId);
            return res.status(404).json({ success: false, error: `Course not found with id of ${req.params.courseId}` });
        }

        // Make sure user is course owner
        // if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        //   return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to add a lesson to course ${course._id}` });
        // }

        const lesson = await Lesson.create(req.body);
        console.log('Lesson created successfully:', lesson._id);

        res.status(200).json({
            success: true,
            data: lesson
        });
    } catch (err) {
        console.error('Error creating lesson:', err.message);
        console.error('Validation errors:', err.errors);

        // Send validation errors to frontend
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', '),
                validationErrors: err.errors
            });
        }

        next(err);
    }
};

// @desc    Update lesson
// @route   PUT /api/v1/lessons/:id
// @access  Private (Instructor/Admin)
exports.updateLesson = async (req, res, next) => {
    try {
        let lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ success: false, error: `Lesson not found with id of ${req.params.id}` });
        }

        // Make sure user is course owner
        // const course = await Course.findById(lesson.course);
        // if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        //   return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to update this lesson` });
        // }

        lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: lesson
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete lesson
// @route   DELETE /api/v1/lessons/:id
// @access  Private (Instructor/Admin)
exports.deleteLesson = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ success: false, error: `Lesson not found with id of ${req.params.id}` });
        }

        // Make sure user is course owner
        // const course = await Course.findById(lesson.course);
        // if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        //   return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to delete this lesson` });
        // }

        await lesson.deleteOne();

        // Decrease lesson count from course
        await Course.findByIdAndUpdate(lesson.course, {
            $inc: { lessonsCount: -1 } // Simplified logic
        });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Upload file for lesson
// @route   PUT /api/v1/lessons/:id/file
// @access  Private (Instructor/Admin)
exports.uploadLessonFile = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ success: false, error: `Lesson not found with id of ${req.params.id}` });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a file' });
        }

        lesson.fileUrl = req.file.filename; // Should be full URL in prod, but filename for now
        await lesson.save();

        res.status(200).json({
            success: true,
            data: lesson.fileUrl
        });
    } catch (err) {
        next(err);
    }
};
