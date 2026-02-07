const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc    Get instructor dashboard stats
// @route   GET /api/v1/reporting/instructor
// @access  Private (Instructor)
exports.getInstructorStats = async (req, res, next) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });
        const courseIds = courses.map(c => c._id);

        const totalStudents = await Progress.distinct('user', { course: { $in: courseIds } });
        const totalEnrollments = await Progress.countDocuments({ course: { $in: courseIds } });

        // Status counts
        const yetToStart = await Progress.countDocuments({ course: { $in: courseIds }, percentCompleted: 0 });
        const inProgress = await Progress.countDocuments({ course: { $in: courseIds }, percentCompleted: { $gt: 0, $lt: 100 } });
        const completed = await Progress.countDocuments({ course: { $in: courseIds }, isCompleted: true });

        res.status(200).json({
            success: true,
            data: {
                totalCourses: courses.length,
                totalStudents: totalStudents.length,
                totalEnrollments,
                status: {
                    yetToStart,
                    inProgress,
                    completed
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get course-wise learner progress
// @route   GET /api/v1/reporting/course/:courseId
// @access  Private (Instructor)
exports.getCourseProgressReport = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }

        // Check ownership
        // if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') { ... }

        const progressData = await Progress.find({ course: req.params.courseId })
            .populate('user', 'name email');

        res.status(200).json({
            success: true,
            count: progressData.length,
            data: progressData
        });
    } catch (err) {
        next(err);
    }
};
