const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');

// @desc    Get instructor dashboard reporting data
// @route   GET /api/v1/reporting/dashboard
// @access  Private (Instructor/Admin)
exports.getInstructorDashboard = async (req, res, next) => {
    try {
        // 1. Get all courses by this instructor
        const instructorCourses = await Course.find({
            instructor: req.user._id
        }).select('_id title');

        const courseIds = instructorCourses.map(c => c._id);

        // 2. Get all progress records for these courses (this IS the enrollment record)
        const progressRecords = await Progress.find({
            course: { $in: courseIds }
        })
            .populate('user', 'name email createdAt')
            .populate('course', 'title');

        const participantData = [];

        for (const progress of progressRecords) {
            // Skip if user or course was deleted
            if (!progress.user || !progress.course) continue;

            const user = progress.user;
            const course = progress.course;

            // Determine status
            let status = 'Yet to Start';
            if (progress.isCompleted) {
                status = 'Completed';
            } else if (progress.completedLessons && progress.completedLessons.length > 0) {
                status = 'In progress';
            } else if (progress.percentCompleted > 0) {
                status = 'In progress'; // Fallback if percentage is set but lessons array is empty/different logic
            }

            // Time spent - Not currently tracked in Progress schema, using placeholder
            const timeSpentFormatted = '-';

            participantData.push({
                _id: progress._id, // Use progress ID as unique key
                userId: user._id,
                userName: user.name,
                userEmail: user.email,
                courseId: course._id,
                courseName: course.title,
                enrolledDate: progress.createdAt || progress.startedAt, // creation of progress doc is enrollment
                startDate: progress.startedAt,
                timeSpent: timeSpentFormatted,
                completionPercentage: progress.percentCompleted || 0,
                completedDate: progress.completedAt || null,
                status
            });
        }

        // Calculate summary stats
        const totalParticipants = participantData.length;
        const yetToStart = participantData.filter(p => p.status === 'Yet to Start').length;
        const inProgress = participantData.filter(p => p.status === 'In progress').length;
        const completed = participantData.filter(p => p.status === 'Completed').length;

        // Sort by enrolled date desc
        participantData.sort((a, b) => new Date(b.enrolledDate) - new Date(a.enrolledDate));

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

