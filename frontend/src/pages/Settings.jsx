import React, { useState } from 'react';
import useAuthStore from '../store/authStore';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Save, Loader2 } from 'lucide-react';

const Settings = () => {
    const { user, checkAuth } = useAuthStore();
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [details, setDetails] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        setDetailsLoading(true);
        try {
            await authService.updateDetails(details);
            await checkAuth();
            toast.success('Profile details updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update details');
        } finally {
            setDetailsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error('New passwords do not match');
        }

        setPasswordLoading(true);
        try {
            await authService.updatePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });
            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            toast.success('Password updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation - Optional if needed for tabs later */}
                <div className="lg:col-span-1 space-y-2">
                    <button className="w-full text-left px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold shadow-sm">
                        General Settings
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 font-medium transition-colors">
                        Security & Password
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 font-medium transition-colors">
                        Notifications
                    </button>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {/* General Details Form */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User className="text-primary" size={24} /> General Information
                        </h2>
                        <form onSubmit={handleDetailsSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={details.name}
                                        onChange={(e) => setDetails({ ...details, name: e.target.value })}
                                        className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        value={details.email}
                                        onChange={(e) => setDetails({ ...details, email: e.target.value })}
                                        className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={detailsLoading}
                                className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
                            >
                                {detailsLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                Save Changes
                            </button>
                        </form>
                    </div>

                    {/* Password Form */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Lock className="text-secondary" size={24} /> Update Password
                        </h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Current Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-secondary transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none"
                                        placeholder="Min 8 characters"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none"
                                        placeholder="Repeat new password"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                            >
                                {passwordLoading ? <Loader2 size={20} className="animate-spin" /> : <Lock size={20} />}
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
