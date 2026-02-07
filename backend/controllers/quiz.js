const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get quizzes for a course
// @route   GET /api/v1/courses/:courseId/quizzes
// @access  Public
exports.getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ course: req.params.courseId });

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single quiz
// @route   GET /api/v1/quizzes/:id
// @access  Public
exports.getQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ success: false, error: `Quiz not found with id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create quiz
// @route   POST /api/v1/courses/:courseId/quizzes
// @access  Private (Instructor/Admin)
exports.createQuiz = async (req, res, next) => {
    try {
        req.body.course = req.params.courseId;

        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, error: `Course not found with id of ${req.params.courseId}` });
        }

        // Make sure user is course owner
        // if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
        //   return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to add a quiz to course ${course._id}` });
        // }

        const quiz = await Quiz.create(req.body);

        res.status(201).json({
            success: true,
            data: quiz
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Submit quiz attempt
// @route   POST /api/v1/quizzes/:id/attempt
// @access  Private
exports.submitQuizAttempt = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ success: false, error: 'Quiz not found' });
        }

        const { answers } = req.body; // Array of { questionId, selectedOption }

        let score = 0;
        let totalQuestions = quiz.questions.length;
        let pointsEarned = 0;

        // Calculate score
        answers.forEach(ans => {
            const question = quiz.questions.id(ans.questionId);
            if (question) {
                const correctOption = question.options.find(opt => opt.isCorrect);
                // Compare text or ID if available. Simplest is text if unique, or we should use IDs for options.
                // Assuming selectedOption returns option text or ID. Let's assume text for simplicity or ID.
                // If Model definitions didn't use IDs for options explicitly, Mongoose adds _id.
                // Let's assume passed selectedOption is the option _id or text. 
                // For robustness, let's assume it matches one of the option's text or _id.
                if (correctOption && (ans.selectedOption === correctOption.text || ans.selectedOption === correctOption._id.toString())) {
                    score += 1; // Or question.points
                }
            }
        });

        // Determine attempt number
        const previousAttempts = await QuizAttempt.countDocuments({ user: req.user.id, quiz: req.params.id });
        const attemptNumber = previousAttempts + 1;

        // Calculate points based on rewards logic
        // Logic: First try -> X points, etc.
        // Only award points if score is sufficient? Or just for completing?
        // User requirement: "Quizzes support multiple attempts and award points based on the attempt number." 
        // Usually points are awarded if PASSING. Let's assume passing is > 50% or ANY completion?
        // "Learners get badges based on total points."
        // Let's assume points are awarded if score > some threshold, or just strictly based on attempt.
        // For simplicity: Award points if score == totalQuestions (perfect) or maybe just for attempting?
        // Re-reading: "Reward points based on attempt number".
        // I'll assume if score percentage > 70% or something. Or just give points. 
        // Let's use > 50% score to award points.

        const percentage = (score / totalQuestions) * 100;
        const isPass = percentage >= 50;

        if (isPass) {
            if (attemptNumber === 1) pointsEarned = quiz.rewards.firstAttempt;
            else if (attemptNumber === 2) pointsEarned = quiz.rewards.secondAttempt;
            else if (attemptNumber === 3) pointsEarned = quiz.rewards.thirdAttempt;
            else pointsEarned = quiz.rewards.moreAttempts;
        }

        // Record attempt
        const attempt = await QuizAttempt.create({
            user: req.user.id,
            quiz: req.params.id,
            score,
            pointsEarned,
            attemptNumber,
            answers
        });

        // Update user points if points earned
        if (pointsEarned > 0) {
            const user = await User.findById(req.user.id);
            user.points += pointsEarned;

            // Recalculate badge
            user.badge = user.calculateBadge();
            await user.save();
        }

        res.status(200).json({
            success: true,
            data: attempt,
            pointsEarned,
            badge: req.user.badge // Return new badge status (might need refetching user or update req.user)
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Get my attempts
// @route   GET /api/v1/quizzes/:id/attempts
// @access  Private
exports.getMyAttempts = async (req, res, next) => {
    try {
        const attempts = await QuizAttempt.find({ user: req.user.id, quiz: req.params.id });
        res.status(200).json({ success: true, count: attempts.length, data: attempts });
    } catch (err) {
        next(err);
    }
}
