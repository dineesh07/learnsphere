import React from 'react';
import useAuthStore from '../store/authStore';
import { User, Mail, Shield, Calendar, Award, Zap } from 'lucide-react';

const Profile = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                {/* Header/Banner */}
                <div className="h-32 bg-gradient-to-r from-primary to-secondary relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg">
                            <div className="w-full h-full rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-extrabold">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="pt-16 pb-12 px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                            <p className="text-gray-500 font-medium capitalize">{user.role}</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 text-center">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Points</p>
                                <div className="flex items-center justify-center gap-1 text-primary font-bold">
                                    <Zap size={14} className="fill-primary" />
                                    {user.points || 0}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 text-center">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Badge</p>
                                <div className="flex items-center justify-center gap-1 text-secondary font-bold">
                                    <Award size={14} />
                                    {user.badge || 'Newbie'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 pb-2 border-b border-gray-100">Contact Information</h2>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                                    <p className="text-gray-700 font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Account Role</p>
                                    <p className="text-gray-700 font-medium capitalize">{user.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Joined Date</p>
                                    <p className="text-gray-700 font-medium">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : 'Recently'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Progress</h3>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                Continue where you left off. You are doing great! Keep learning to earn more points and unlock new badges.
                            </p>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">Course Completion</span>
                                    <span className="font-bold text-primary">65%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <button className="w-full mt-8 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                                View My Learning
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
