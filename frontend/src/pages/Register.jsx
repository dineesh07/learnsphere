import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import PasswordValidator from '../components/PasswordValidator';
import { validatePassword } from '../utils/passwordValidation';

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const registerUser = useAuthStore((state) => state.register);
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

        try {
            await registerUser({ ...data, role: 'learner' }); // Force learner role
            toast.success('Registered successfully');
            navigate('/browse');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-background">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-text">
                    Create an account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join LearnSphere and start your learning journey
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-text">
                            Full Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="name"
                                type="text"
                                {...register('name', { required: 'Name is required' })}
                                className="block w-full rounded-md border-0 py-2 px-3 text-text shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-text">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="block w-full rounded-md border-0 py-2 px-3 text-text shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-text">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                onFocus={() => setShowPasswordValidator(true)}
                                className="block w-full rounded-md border-0 py-2 px-3 text-text shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            {showPasswordValidator && <PasswordValidator password={password} />}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-xs text-blue-800">
                            <strong>Note:</strong> This registration is for learners only. If you would like to become an instructor, please contact an administrator.
                        </p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            Sign up
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already a member?{' '}
                    <Link to="/login" className="font-semibold leading-6 text-primary hover:text-primary/80">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
