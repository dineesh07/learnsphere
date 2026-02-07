const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const errorHandler = require('./middleware/error');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'], // Allow multiple local ports
    credentials: true // Allow cookies
}));
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
console.log('Loading admin routes...');
app.use('/api/v1/admin', require('./routes/admin'));
console.log('Admin routes loaded successfully');
app.use('/api/v1/reporting', require('./routes/reporting'));
// app.use('/api/v1/lessons', require('./routes/lesson')); // Standalone if needed
app.use('/api/v1/quizzes', require('./routes/quiz'));
// app.use('/api/v1/reviews', require('./routes/review'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(errorHandler);

module.exports = app;
