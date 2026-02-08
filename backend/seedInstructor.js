const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedInstructor = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');

        // Define User schema inline to avoid middleware issues
        const UserSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            role: String,
            isApproved: Boolean,
            createdAt: { type: Date, default: Date.now },
            points: { type: Number, default: 0 },
            badge: String
        });

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // Check if instructor already exists
        const existingInstructor = await User.findOne({ email: 'instructor@learnsphere.com' });

        if (existingInstructor) {
            console.log('✅ Instructor user already exists!');
            console.log('==================================');
            console.log('Email: instructor@learnsphere.com');
            console.log('Password: Instructor@123');
            console.log('==================================');
            await mongoose.disconnect();
            process.exit(0);
        }

        // Manually hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Instructor@123', salt);

        // Insert directly
        await User.create({
            name: 'John Instructor',
            email: 'instructor@learnsphere.com',
            password: hashedPassword,
            role: 'instructor',
            isApproved: true,
            points: 0,
            badge: 'Newbie'
        });

        console.log('✅ Instructor user created successfully!');
        console.log('==================================');
        console.log('Email: instructor@learnsphere.com');
        console.log('Password: Instructor@123');
        console.log('==================================');
        console.log('You can now login at http://localhost:5173/login');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding instructor:', error);
        process.exit(1);
    }
};

seedInstructor();
