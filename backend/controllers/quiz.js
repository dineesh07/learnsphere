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
        console.log('=== Quiz Submission Start ===');
        console.log('Quiz ID:', req.params.id);
        console.log('User:', req.user?.id);
        console.log('Answers:', JSON.stringify(req.body.answers, null, 2));

        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            console.error('Quiz not found');
            return res.status(404).json({ success: false, error: 'Quiz not found' });
        }
        console.log('Quiz found:', quiz.title);

        const { answers } = req.body; // Array of { questionId, selectedOption }

        if (!answers || !Array.isArray(answers)) {
            console.error('Invalid answers format');
            return res.status(400).json({ success: false, error: 'Answers must be an array' });
        }

        let score = 0;
        let totalQuestions = quiz.questions.length;
        let pointsEarned = 0;

        console.log('Calculating score...');
        // Calculate score
        answers.forEach(ans => {
            const question = quiz.questions.id(ans.questionId);
            if (question) {
                console.log(`\nQuestion ID: ${ans.questionId}`);
                console.log(`Selected option: ${ans.selectedOption}`);
                console.log(`Question options:`, question.options.map(o => ({ id: o._id.toString(), text: o.text, isCorrect: o.isCorrect })));

                const correctOption = question.options.find(opt => opt.isCorrect);
                console.log(`Correct option ID: ${correctOption?._id.toString()}`);

                // Convert both to strings for comparison
                const selectedOptionStr = ans.selectedOption.toString();
                const correctOptionStr = correctOption?._id.toString();

                console.log(`Comparing: "${selectedOptionStr}" === "${correctOptionStr}"`);

                if (correctOption && selectedOptionStr === correctOptionStr) {
                    score += 1;
                    console.log('  ✓ CORRECT!');
                } else {
                    console.log('  ✗ INCORRECT');
                }
            } else {
                console.log(`Question ${ans.questionId} not found in quiz`);
            }
        });

        console.log(`Final score: ${score}/${totalQuestions}`);

        // Determine attempt number
        console.log('Counting previous attempts...');
        const previousAttempts = await QuizAttempt.countDocuments({ user: req.user.id, quiz: req.params.id });
        const attemptNumber = previousAttempts + 1;
        console.log('Attempt number:', attemptNumber);

        const percentage = (score / totalQuestions) * 100;
        const isPass = percentage >= 50;
        console.log(`Percentage: ${percentage}%, Pass: ${isPass}`);

        if (isPass) {
            if (attemptNumber === 1) pointsEarned = quiz.rewards.firstAttempt;
            else if (attemptNumber === 2) pointsEarned = quiz.rewards.secondAttempt;
            else if (attemptNumber === 3) pointsEarned = quiz.rewards.thirdAttempt;
            else pointsEarned = quiz.rewards.moreAttempts;
        }
        console.log('Points earned:', pointsEarned);

        // Record attempt
        console.log('Creating attempt record...');
        const attempt = await QuizAttempt.create({
            user: req.user.id,
            quiz: req.params.id,
            score,
            pointsEarned,
            attemptNumber,
            answers
        });
        console.log('Attempt created:', attempt._id);

        // Update user points if points earned
        if (pointsEarned > 0) {
            console.log('Updating user points...');
            const user = await User.findById(req.user.id);
            user.points = (user.points || 0) + pointsEarned;
            await user.save();
            console.log('User points updated to:', user.points);
        }

        console.log('=== Quiz Submission Success ===');

        const responseData = {
            success: true,
            data: {
                _id: attempt._id,
                user: attempt.user,
                quiz: attempt.quiz,
                score: attempt.score,
                pointsEarned: attempt.pointsEarned,
                attemptNumber: attempt.attemptNumber,
                answers: attempt.answers,
                completedAt: attempt.completedAt
            },
            score,
            pointsEarned,
            attemptNumber
        };

        console.log('Sending response:', JSON.stringify(responseData, null, 2));
        res.status(200).json(responseData);

    } catch (err) {
        console.error('=== Quiz Submission Error ===');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);

        res.status(500).json({
            success: false,
            error: err.message || 'Failed to submit quiz',
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
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
