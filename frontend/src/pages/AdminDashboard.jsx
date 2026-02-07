import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { UserPlus, Trash2, CheckCircle, XCircle, Loader } from 'lucide-react';
import PasswordValidator from '../components/PasswordValidator';
import { validatePassword } from '../utils/passwordValidation';

const AdminDashboard = () => {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showPasswordValidator, setShowPasswordValidator] = useState(false);

    const password = watch('password', '');

    // Fetch instructors
    const fetchInstructors = async () => {
        try {
            const response = await api.get('/admin/instructors');
            setInstructors(response.data.data);
        } catch (error) {
            toast.error('Failed to load instructors');
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, []);

    const onSubmit = async (data) => {
        // Validate password
        const validation = validatePassword(data.password);
        if (!validation.isValid) {
            toast.error('Please meet all password requirements');
            return;
        }

        setLoading(true);
        try {
            await api.post('/admin/instructors', data);
            toast.success('Instructor created successfully');
            reset();
            setShowForm(false);
            setShowPasswordValidator(false);
            fetchInstructors();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create instructor');
        } finally {
            setLoading(false);
        }
    };

    const deleteInstructor = async (id) => {
        if (!confirm('Are you sure you want to delete this instructor?')) return;

        try {
            await api.delete(`/admin/instructors/${id}`);
            toast.success('Instructor deleted');
            fetchInstructors();
        } catch (error) {
            toast.error('Failed to delete instructor');
        }
    };

    const toggleApproval = async (id, currentStatus) => {
        try {
            await api.put(
                `/admin/instructors/${id}`,
                { isApproved: !currentStatus }
            );
            toast.success(`Instructor ${!currentStatus ? 'approved' : 'unapproved'}`);
            fetchInstructors();
        } catch (error) {
            toast.error('Failed to update instructor');
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text">Instructor Management</h1>
                        <p className="mt-2 text-gray-600">Create and manage instructor accounts</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 transition-all"
                    >
                        <UserPlus size={18} />
                        Create Instructor
                    </button>
                </div>

                {/* Create Instructor Form */}
                {showForm && (
                    <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-text mb-6">Create New Instructor</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Name is required' })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        {...register('email', { required: 'Email is required' })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    {...register('password', { required: 'Password is required' })}
                                    onFocus={() => setShowPasswordValidator(true)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                                )}
                                {showPasswordValidator && <PasswordValidator password={password} />}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-gray-800 disabled:opacity-50 transition-all"
                                >
                                    {loading ? <Loader size={16} className="animate-spin" /> : <UserPlus size={16} />}
                                    Create Instructor
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        reset();
                                        setShowPasswordValidator(false);
                                    }}
                                    className="rounded-full px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Instructors List */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-text">
                            All Instructors ({instructors.length})
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {instructors.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No instructors yet. Create the first one!
                                        </td>
                                    </tr>
                                ) : (
                                    instructors.map((instructor) => (
                                        <tr key={instructor._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-text">{instructor.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{instructor.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleApproval(instructor._id, instructor.isApproved)}
                                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${instructor.isApproved
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                >
                                                    {instructor.isApproved ? (
                                                        <>
                                                            <CheckCircle size={14} /> Approved
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle size={14} /> Pending
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(instructor.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => deleteInstructor(instructor._id)}
                                                    className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
