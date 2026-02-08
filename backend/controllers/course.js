const Course = require('../models/Course');
const path = require('path');
const sendEmail = require('../utils/sendEmail');

// @desc    Get instructor's published courses for navbar
// @route   GET /api/v1/courses/instructor/published
// @access  Private (Instructor)
exports.getInstructorPublishedCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({
            instructor: req.user.id,
            published: true
        })
            .select('title _id')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        query = Course.find(JSON.parse(queryStr)).populate('instructor', 'name');

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Course.countDocuments();

        query = query.skip(startIndex).limit(limit);
        const courses = await query;

        const pagination = {};
        if (endIndex < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({
            success: true,
            count: courses.length,
            pagination,
            data: courses
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'name')
            .populate('lessons')
            .populate('quizzes');

        if (!course) {
            return res.status(404).json({ success: false, error: `Course not found with id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: course });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new course
// @route   POST /api/v1/courses
// @access  Private (Instructor/Admin)
exports.createCourse = async (req, res, next) => {
    try {
        req.body.instructor = req.user.id;
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (err) {
        next(err);
    }
};

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private (Instructor/Admin)
exports.updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, error: `Course not found with id of ${req.params.id}` });
        }

        // Make sure user is course owner
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: `User ${req.user.id} is not authorized to update this course`
            });
        }

        // Clean up empty ObjectId fields to prevent CastError
        if (req.body.responsibleUser === '' || req.body.responsibleUser === null) {
            delete req.body.responsibleUser;
        }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: course });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private (Instructor/Admin)
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, error: `Course not found with id of ${req.params.id}` });
        }

        // Make sure user is course owner
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: `User ${req.user.id} is not authorized to delete this course`
            });
        }

        await course.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Upload photo for course
// @route   PUT /api/v1/courses/:id/photo
// @access  Private (Instructor/Admin)
exports.uploadCoursePhoto = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, error: `Course not found with id of ${req.params.id}` });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a file' });
        }
        course.image = req.file.filename;
        await course.save();
        res.status(200).json({ success: true, data: course.image });
    } catch (err) {
        next(err);
    }
};

// @desc    Invite user to course
// @route   POST /api/v1/courses/:id/invite
// @access  Private (Instructor/Admin)
exports.inviteUser = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, error: `Course not found with id of ${req.params.id}` });
        }
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, error: 'Please provide an email' });
        }
        const message = `You have been invited to join the course: ${course.title}. Please login and enroll.`;
        try {
            await sendEmail({
                email: email,
                subject: 'Course Invitation',
                message
            });
            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, error: 'Email could not be sent' });
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Email course attendees
// @route   POST /api/v1/courses/:id/email-attendees
// @access  Private (Instructor/Admin)
exports.emailCourseAttendees = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate('enrolledUsers', 'email name');
        if (!course) {
            return res.status(404).json({ success: false, error: `Course not found with id of ${req.params.id}` });
        }

        // Make sure user is course owner
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: `User ${req.user.id} is not authorized to email attendees of this course`
            });
        }

        const { subject, message, recipients } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ success: false, error: 'Please provide subject and message' });
        }

        // Get recipient list
        let emailList = [];
        if (recipients === 'all' || !recipients) {
            // Email all enrolled users
            emailList = course.enrolledUsers || [];
        } else if (Array.isArray(recipients)) {
            // Email specific users by ID
            emailList = (course.enrolledUsers || []).filter(user =>
                recipients.includes(user._id.toString())
            );
        }

        if (emailList.length === 0) {
            return res.status(400).json({ success: false, error: 'No enrolled users to email' });
        }

        // Send emails
        const emailPromises = emailList.map(user => {
            const emailMessage = `
Hello ${user.name},

${message}

---
This email was sent by your instructor for the course: ${course.title}

Best regards,
LearnSphere Team
            `.trim();

            return sendEmail({
                email: user.email,
                subject: `[${course.title}] ${subject}`,
                message: emailMessage
            });
        });

        try {
            await Promise.all(emailPromises);
            res.status(200).json({
                success: true,
                data: `Email sent to ${emailList.length} attendee(s)`
            });
        } catch (emailErr) {
            console.error('Email sending error:', emailErr);
            return res.status(500).json({
                success: false,
                error: 'Some emails could not be sent. Please try again.'
            });
        }
    } catch (err) {
        next(err);
    }
};

