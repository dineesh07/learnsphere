const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
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

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@learnsphere.com' });

        if (existingAdmin) {
            console.log('✅ Admin user already exists!');
            console.log('==================================');
            console.log('Email: admin@learnsphere.com');
            console.log('Password: Admin@123');
            console.log('==================================');
            await mongoose.disconnect();
            process.exit(0);
        }

        // Manually hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);

        // Insert directly
        await User.create({
            name: 'Admin User',
            email: 'admin@learnsphere.com',
            password: hashedPassword,
            role: 'admin',
            isApproved: true,
            points: 0,
            badge: 'Newbie'
        });

        console.log('✅ Admin user created successfully!');
        console.log('==================================');
        console.log('Email: admin@learnsphere.com');
        console.log('Password: Admin@123');
        console.log('==================================');
        console.log('You can now login at http://localhost:5173/admin');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
