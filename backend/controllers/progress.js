const Progress = require('../models/Progress');
const Course = require('../models/Course');

// @desc    Get course progress for user
// @route   GET /api/v1/courses/:courseId/progress
// @access  Private
exports.getProgress = async (req, res, next) => {
    try {
        console.log('=== getProgress Debug ===');
        console.log('params:', req.params);
        console.log('user:', req.user);
        console.log('user.id:', req.user?.id);
        console.log('courseId:', req.params.courseId);

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        let progress = await Progress.findOne({ user: req.user.id, course: req.params.courseId });

        if (!progress) {
            console.log('Creating new progress record for user:', req.user.id, 'course:', req.params.courseId);
            // Create initial progress if not exists
            progress = await Progress.create({
                user: req.user.id,
                course: req.params.courseId
            });
        }

        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (err) {
        console.error('Error in getProgress:', err);
        next(err);
    }
};

// @desc    Mark lesson as completed
// @route   PUT /api/v1/courses/:courseId/progress/lesson/:lessonId
// @access  Private
exports.updateProgress = async (req, res, next) => {
    try {
        let progress = await Progress.findOne({ user: req.user.id, course: req.params.courseId });

        if (!progress) {
            progress = await Progress.create({
                user: req.user.id,
                course: req.params.courseId
            });
        }

        // Add lesson to completedLessons if not already there
        if (!progress.completedLessons.includes(req.params.lessonId)) {
            progress.completedLessons.push(req.params.lessonId);
        }

        // Calculate percent completed
        const course = await Course.findById(req.params.courseId);
        const totalLessons = course.lessonsCount || 1; // Avoid division by zero
        progress.percentCompleted = (progress.completedLessons.length / totalLessons) * 100;

        if (progress.percentCompleted >= 100) {
            progress.isCompleted = true;
            progress.completedAt = Date.now();
        }

        await progress.save();

        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (err) {
        next(err);
    }
};
