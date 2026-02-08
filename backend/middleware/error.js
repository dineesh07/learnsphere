const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    // Log to console for dev
    console.error(err.stack || err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = { message, statusCode: 400 };
    }

    // Mongoose buffering timeout (Database unreachable)
    if (err.message && (err.message.includes('buffering timed out') || err.message.includes('timeout'))) {
        const message = 'Database connection timed out. Please check your network or IP whitelist.';
        error = { message, statusCode: 503 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
};

module.exports = errorHandler;
