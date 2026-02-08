import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import PasswordValidator from '../components/PasswordValidator';
import { validatePassword } from '../utils/passwordValidation';
import { User, Mail, Lock, ArrowRight, Sparkles, Loader2, Info } from 'lucide-react';

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const registerUser = useAuthStore((state) => state.register);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [showPasswordValidator, setShowPasswordValidator] = useState(false);

    const password = watch('password', '');

    const onSubmit = async (data) => {
        // Validate password before submitting
        const validation = validatePassword(data.password);
        if (!validation.isValid) {
            toast.error('Please meet all password requirements');
            return;
        }

        setIsLoading(true);
        try {
            await registerUser({ ...data, role: 'learner' }); // Force learner role
            toast.success('Welcome to LearnSphere! Your journey starts here.');
            navigate('/browse');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -bottom-24 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-0 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in-up">
                <div className="flex justify-center mb-6">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                            <Sparkles size={28} className="text-secondary" />
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-tighter">LearnSphere</span>
                    </Link>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join thousands of learners worldwide today.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="bg-white/80 backdrop-blur-xl py-10 px-6 shadow-2xl shadow-gray-200/50 sm:rounded-3xl sm:px-12 border border-white">
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="name" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    {...register('name', { required: 'Name is required' })}
                                    placeholder="John Doe"
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium italic">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    placeholder="name@example.com"
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium italic">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    {...register('password', { required: 'Password is required' })}
                                    onFocus={() => setShowPasswordValidator(true)}
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium italic">{errors.password.message}</p>}
                            {showPasswordValidator && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <PasswordValidator password={password} />
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex gap-3">
                            <Info size={18} className="text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                                This registration is for <span className="font-bold">learners only</span>. Instructors are onboarded manually by administrators.
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-primary hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-primary hover:text-indigo-500 transition-colors">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
