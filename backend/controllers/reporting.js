const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');

// @desc    Get instructor dashboard reporting data
// @route   GET /api/v1/reporting/dashboard
// @access  Private (Instructor/Admin)
exports.getInstructorDashboard = async (req, res, next) => {
    try {
        // Get all courses by this instructor
        const instructorCourses = await Course.find({
            instructor: req.user._id
        }).select('_id title');

        const courseIds = instructorCourses.map(c => c._id);

        // Get all courses with enrolled users
        const courses = await Course.find({
            _id: { $in: courseIds }
        }).populate('enrolledUsers', 'name email createdAt');

        const participantData = [];

        for (const course of courses) {
            if (!course.enrolledUsers || course.enrolledUsers.length === 0) continue;

            for (const user of course.enrolledUsers) {
                // Get progress for this user in this course
                const progress = await Progress.find({
                    user: user._id,
                    course: course._id
                }).populate('lesson');

                // Get total lessons in course
                const totalLessons = await Lesson.countDocuments({ course: course._id });

                // Calculate completion
                const completedLessons = progress.filter(p => p.completed).length;
                const completionPercentage = totalLessons > 0
                    ? Math.round((completedLessons / totalLessons) * 100)
                    : 0;

                // Calculate total time spent (in minutes)
                const totalMinutes = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
                const hours = Math.floor(totalMinutes / 60);
                const mins = totalMinutes % 60;
                const timeSpentFormatted = `${hours}:${mins.toString().padStart(2, '0')}`;

                // Determine status
                let status;
                if (completedLessons === 0) {
                    status = 'Yet to Start';
                } else if (completionPercentage === 100) {
                    status = 'Completed';
                } else {
                    status = 'In progress';
                }

                // Get enrollment date
                const enrolledDate = user.createdAt;

                // Get start date (first progress entry)
                const sortedProgress = progress.sort((a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
                const startDate = sortedProgress.length > 0 ? sortedProgress[0].createdAt : null;

                // Get completed date (when all lessons marked complete)
                const completedProgress = progress
                    .filter(p => p.completed)
                    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
                const completedDate = completionPercentage === 100 && completedProgress.length > 0
                    ? completedProgress[0].completedAt
                    : null;

                participantData.push({
                    _id: `${user._id}-${course._id}`,
                    userId: user._id,
                    userName: user.name,
                    userEmail: user.email,
                    courseId: course._id,
                    courseName: course.title,
                    enrolledDate,
                    startDate,
                    timeSpent: timeSpentFormatted,
                    completionPercentage,
                    completedDate,
                    status
                });
            }
        }

        // Calculate summary stats
        const totalParticipants = participantData.length;
        const yetToStart = participantData.filter(p => p.status === 'Yet to Start').length;
        const inProgress = participantData.filter(p => p.status === 'In progress').length;
        const completed = participantData.filter(p => p.status === 'Completed').length;

        res.status(200).json({
            success: true,
            data: {
                totalParticipants,
                yetToStart,
                inProgress,
                completed,
                participants: participantData
            }
        });
    } catch (error) {
        console.error('Reporting dashboard error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch reporting data'
        });
    }
};

// @desc    Get instructor stats (placeholder for existing route)
// @route   GET /api/v1/reporting/instructor
// @access  Private (Instructor/Admin)
exports.getInstructorStats = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                message: 'Instructor stats endpoint - to be implemented'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch instructor stats'
        });
    }
};

// @desc    Get course progress report (placeholder for existing route)
// @route   GET /api/v1/reporting/course/:courseId
// @access  Private (Instructor/Admin)
exports.getCourseProgressReport = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                message: 'Course progress report endpoint - to be implemented'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch course progress report'
        });
    }
};

