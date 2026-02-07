import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { Shield, Lock, Mail } from 'lucide-react';

const AdminLogin = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await login(data);
            const user = useAuthStore.getState().user;

            // Check if logged in user is actually an admin
            if (user?.role !== 'admin') {
                toast.error('Access denied. Admin credentials required.');
                useAuthStore.getState().logout();
                return;
            }

            toast.success('Welcome, Admin!');
            navigate('/admin/instructors');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full">
                {/* Admin Badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full shadow-lg mb-4 border-2 border-gray-300">
                        <Shield className="w-10 h-10 text-gray-900" />
                    </div>
                    <h1 className="text-3xl font-bold text-text mb-2">Admin Portal</h1>
                    <p className="text-gray-600">LearnSphere Administration</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-text mb-2">Sign In</h2>
                        <p className="text-gray-600 text-sm">Enter your admin credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                                    placeholder="admin@learnsphere.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    {...register('password', { required: 'Password is required' })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                                    placeholder="Enter your password"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Info Alert */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <Shield className="w-5 h-5 text-gray-900 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-900 font-medium">Admin Access Only</p>
                                    <p className="text-xs text-gray-700 mt-1">
                                        This portal is restricted to administrators. Unauthorized access attempts will be logged.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all shadow-lg"
                        >
                            Sign In to Admin Portal
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Need help? Contact system administrator
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
