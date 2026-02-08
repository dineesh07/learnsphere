const path = require('path');

// @desc    Upload any file (video, document, image)
// @route   POST /api/v1/upload
// @access  Private (Instructor/Admin)
exports.uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a file' });
        }

        // Return the path relative to the server root (accessible via static middleware)
        // Since app.js serves '/uploads', we can return just the filename or the full path.
        // Returning full relative path is safer for frontend usage.

        // Construct URL based on server configuration (assuming standard serving)
        // req.file.path is like 'uploads\filename.ext' on Windows
        // We want '/uploads/filename.ext'

        const filePath = `/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            data: {
                filename: req.file.filename,
                path: filePath,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
    } catch (err) {
        next(err);
    }
};
