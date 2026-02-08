const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB Atlas...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 20000, // Timeout after 20s instead of 10s
            connectTimeoutMS: 20000,
            family: 4 // Force IPv4 if needed
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('CRITICAL: MongoDB Connection Failed!');
        console.error(`Reason: ${error.message}`);
        console.log('Server will continue running, but DB-dependent features will fail.');
    }
};

module.exports = connectDB;
