import { X, Users, Eye, Star, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function CourseAnalyticsModal({ isOpen, onClose, course }) {
    if (!course) return null;

    // Calculate mock analytics data (in real app, fetch from API)
    const analytics = {
        totalViews: course.viewsCount || 0,
        totalEnrollments: course.studentsEnrolled || 0,
        completionRate: 75, // percent
        averageRating: course.averageRating || 4.5,
        revenue: course.accessRule === 'payment' ? (course.price * (course.studentsEnrolled || 0)) : 0,
        avgWatchTime: Math.round((course.totalDuration || 0) * 0.7), // minutes
        engagementRate: 82, // percent
    };

    const stats = [
        {
            name: 'Total Views',
            value: analytics.totalViews.toLocaleString(),
            icon: Eye,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            name: 'Total Enrollments',
            value: analytics.totalEnrollments.toLocaleString(),
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            name: 'Average Rating',
            value: `${analytics.averageRating.toFixed(1)} / 5.0`,
            icon: Star,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            name: 'Completion Rate',
            value: `${analytics.completionRate}%`,
            icon: CheckCircle,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            name: 'Engagement Rate',
            value: `${analytics.engagementRate}%`,
            icon: TrendingUp,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
        {
            name: 'Avg. Watch Time',
            value: `${Math.floor(analytics.avgWatchTime / 60)}h ${analytics.avgWatchTime % 60}m`,
            icon: Clock,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
        },
    ];

    if (course.accessRule === 'payment') {
        stats.push({
            name: 'Total Revenue',
            value: `₹${analytics.revenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        });
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <Dialog.Title className="text-2xl font-bold text-gray-900">
                                            Course Analytics
                                        </Dialog.Title>
                                        <p className="mt-1 text-sm text-gray-500">{course.title}</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {stats.map((stat) => {
                                        const Icon = stat.icon;
                                        return (
                                            <div
                                                key={stat.name}
                                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                                        <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                                                            {stat.value}
                                                        </p>
                                                    </div>
                                                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Additional Info */}
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Course Details</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Status:</span>
                                            <span className={`ml-2 font-medium ${course.published ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {course.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Access:</span>
                                            <span className="ml-2 font-medium text-gray-900">
                                                {course.accessRule === 'payment' ? 'Paid' : 'Free'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Lessons:</span>
                                            <span className="ml-2 font-medium text-gray-900">
                                                {course.lessonsCount || 0}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Duration:</span>
                                            <span className="ml-2 font-medium text-gray-900">
                                                {Math.floor((course.totalDuration || 0) / 60)}h {(course.totalDuration || 0) % 60}m
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
