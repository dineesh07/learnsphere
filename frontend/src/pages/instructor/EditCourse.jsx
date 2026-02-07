import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import courseService from '../../services/courseService';
import toast from 'react-hot-toast';
import { Tab } from '@headlessui/react';
import LessonList from '../../components/LessonList';
import QuizBuilder from './QuizBuilder';
import ContentTypeSelector from '../../components/ContentTypeSelector';
import ContentUploadWizard from '../../components/ContentUploadWizard';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, setValue } = useForm();

    // Tabs
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Quiz Builder State
    const [showQuizBuilder, setShowQuizBuilder] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);

    // Content Upload Wizard State
    const [showContentWizard, setShowContentWizard] = useState(false);
    const [selectedContentType, setSelectedContentType] = useState('video');
    const [showContentTypeSelector, setShowContentTypeSelector] = useState(false);

    // Instructors list for responsible user dropdown
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        fetchCourse();
        fetchInstructors();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const res = await courseService.getCourse(id);
            setCourse(res.data);
            // Set form values
            setValue('title', res.data.title);
            setValue('description', res.data.description);
            setValue('published', res.data.published);
            setValue('price', res.data.price);
            setValue('visibility', res.data.visibility || 'everyone');
            setValue('accessRule', res.data.accessRule || 'open');
            setValue('responsibleUser', res.data.responsibleUser || '');
        } catch (error) {
            toast.error('Failed to load course');
            navigate('/instructor/courses');
        } finally {
            setLoading(false);
        }
    };

    const fetchInstructors = async () => {
        try {
            const response = await fetch('/api/v1/auth/instructors', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setInstructors(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch instructors:', error);
        }
    };

    const onSubmit = async (data) => {
        try {
            const res = await courseService.updateCourse(id, data);
            setCourse(res.data);
            toast.success('Course updated');
        } catch (error) {
            toast.error('Failed to update course');
        }
    };

    const onPublishToggle = async () => {
        try {
            const newData = { published: !course.published };
            const res = await courseService.updateCourse(id, newData);
            setCourse(res.data);
            toast.success(newData.published ? 'Course Published!' : 'Course Unpublished');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleCreateLesson = async (lessonData) => {
        try {
            // Clean the payload - remove empty strings and undefined values
            const cleanedData = Object.entries(lessonData).reduce((acc, [key, value]) => {
                if (value !== '' && value !== undefined && value !== null) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const payload = {
                ...cleanedData,
                course: id,
                order: course.lessons?.length || 0
            };

            console.log('Creating lesson with payload:', JSON.stringify(payload, null, 2));
            const response = await courseService.addLesson(id, payload);
            console.log('Lesson created successfully:', response);
            toast.success('Content added successfully!');
            await fetchCourse(); // Refresh course data
            setShowContentWizard(false); // Close the wizard
        } catch (error) {
            console.error('Failed to create lesson:', error);
            console.error('Error response:', JSON.stringify(error.response?.data, null, 2));
            toast.error(error.response?.data?.error || 'Failed to add content');
        }
    };

    const handleAddContent = (contentType) => {
        setSelectedContentType(contentType);
        setShowContentWizard(true);
    };

    if (loading) return <div>Loading...</div>;
    if (!course) return <div>Course not found</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Course: {course.title}</h1>
                <div className="flex gap-2">
                    <button
                        onClick={onPublishToggle}
                        className={`px-4 py-2 rounded text-white ${course.published ? 'bg-red-600' : 'bg-green-600'}`}
                    >
                        {course.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button className="bg-gray-200 px-4 py-2 rounded text-gray-700">Preview</button>
                </div>
            </div>

            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
                    {['Details', 'Description', 'Content', 'Options', 'Quiz'].map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                    'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                    selected
                                        ? 'bg-white text-blue-700 shadow'
                                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                )
                            }
                        >
                            {category}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels>
                    {/* Details Tab */}
                    <Tab.Panel>
                        <div className="bg-white p-6 rounded shadow">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Title</label>
                                    <input {...register('title')} className="mt-1 block w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Description</label>
                                    <textarea {...register('description')} rows={4} className="mt-1 block w-full border p-2 rounded" />
                                </div>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Details</button>
                            </form>
                        </div>
                    </Tab.Panel>

                    {/* Description Tab */}
                    <Tab.Panel>
                        <div className="bg-white p-6 rounded shadow">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Description
                                    </label>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Provide a detailed description of what students will learn in this course. This will be displayed on the course page.
                                    </p>
                                    <textarea
                                        {...register('description')}
                                        rows={12}
                                        placeholder="This course covers the functional configuration of Odoo CRM, including lead management, opportunity workflows, pipeline stages, and activity scheduling. It also explains CRM reporting, automation rules, and integration with Sales for end-to-end process handling."
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Save Description
                                </button>
                            </form>
                        </div>
                    </Tab.Panel>

                    {/* Content Tab (Lessons) */}
                    <Tab.Panel>
                        <div className="bg-white p-6 rounded-lg shadow">
                            {/* Header with Add Content Button */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Course Content</h2>
                                    <p className="text-sm text-gray-500 mt-1">Manage your lessons and learning materials</p>
                                </div>
                                <button
                                    onClick={() => setShowContentTypeSelector(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Add Content
                                </button>
                            </div>

                            {/* Lessons List */}
                            {course.lessons && course.lessons.length > 0 ? (
                                <div className="space-y-3">
                                    {course.lessons.map((lesson, index) => (
                                        <div
                                            key={lesson._id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>

                                                        {/* Content Type Badge */}
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${lesson.type === 'video'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : lesson.type === 'document'
                                                                ? 'bg-indigo-100 text-indigo-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {lesson.type?.charAt(0).toUpperCase() + lesson.type?.slice(1)}
                                                        </span>

                                                        <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
                                                    </div>

                                                    {lesson.description && (
                                                        <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                                                    )}

                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        {lesson.duration > 0 && (
                                                            <span>Duration: {lesson.duration} min</span>
                                                        )}
                                                        {lesson.videoUrl && (
                                                            <span className="text-blue-600">Video Link</span>
                                                        )}
                                                        {lesson.fileUrl && (
                                                            <span className="text-blue-600">File Attached</span>
                                                        )}
                                                        {lesson.allowDownload && (
                                                            <span className="text-green-600">✓ Downloadable</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 ml-4">
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                        <PencilSquareIcon className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">No content yet</h3>
                                    <p className="text-sm text-gray-500 mb-4">Start by adding your first lesson</p>
                                    <button
                                        onClick={() => setShowContentTypeSelector(true)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        Add Your First Content
                                    </button>
                                </div>
                            )}

                            {/* Content Type Selector Modal */}
                            {showContentTypeSelector && (
                                <div className="fixed inset-0 z-50 overflow-y-auto">
                                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                        {/* Background overlay */}
                                        <div
                                            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                                            onClick={() => setShowContentTypeSelector(false)}
                                        ></div>

                                        {/* Modal panel */}
                                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                            <div className="bg-white px-6 py-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                    Select Content Type
                                                </h3>
                                                <ContentTypeSelector
                                                    selected={selectedContentType}
                                                    onChange={(type) => {
                                                        setSelectedContentType(type);
                                                        setShowContentTypeSelector(false);
                                                        setShowContentWizard(true);
                                                    }}
                                                />
                                            </div>
                                            <div className="bg-gray-50 px-6 py-3 flex justify-end">
                                                <button
                                                    onClick={() => setShowContentTypeSelector(false)}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content Upload Wizard Modal */}
                            <ContentUploadWizard
                                isOpen={showContentWizard}
                                onClose={() => setShowContentWizard(false)}
                                onSubmit={handleCreateLesson}
                                contentType={selectedContentType}
                                courseId={id}
                            />
                        </div>
                    </Tab.Panel>

                    {/* Options Tab */}
                    <Tab.Panel>
                        <div className="bg-white p-6 rounded shadow space-y-6">
                            <h3 className="text-lg font-bold border-b pb-2">Access & Visibility</h3>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Visibility */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Show course to</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                {...register('visibility')}
                                                value="everyone"
                                                className="mr-2 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            Everyone
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                {...register('visibility')}
                                                value="signedin"
                                                className="mr-2 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            Signed In Users Only
                                        </label>
                                    </div>
                                </div>

                                {/* Access Rules */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Access Rule</label>
                                    <select
                                        {...register('accessRule')}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                    >
                                        <option value="open">Open (Free for all)</option>
                                        <option value="invitation">On Invitation</option>
                                        <option value="payment">On Payment</option>
                                    </select>
                                </div>

                                {/* Price (Conditional) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            {...register('price')}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md border p-2"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Only applicable if Access Rule is 'Payment'.</p>
                                </div>

                                {/* Responsible User */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Admin (Responsible User)
                                    </label>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Decide who'll be the responsible of the course
                                    </p>
                                    <select
                                        {...register('responsibleUser')}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                    >
                                        <option value="">Select instructor...</option>
                                        {instructors.map(instructor => (
                                            <option key={instructor._id} value={instructor._id}>
                                                {instructor.name} ({instructor.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="border-t pt-4">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                    >
                                        Save Options
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Tab.Panel>

                    {/* Quiz Tab */}
                    <Tab.Panel>
                        <div className="bg-white p-6 rounded shadow">
                            <div className="flex justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold">Quizzes</h3>
                                    <p className="text-sm text-gray-500">Manage quizzes and rewards</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedQuizId(null);
                                        setShowQuizBuilder(true);
                                    }}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 flex items-center"
                                >
                                    + Add Quiz
                                </button>
                            </div>

                            {(() => {
                                console.log('Quiz Debug - course.quizzes:', course?.quizzes);
                                console.log('Quiz Debug - quizzes length:', course?.quizzes?.length);
                                return null;
                            })()}

                            {course?.quizzes && course.quizzes.length > 0 ? (
                                <div className="space-y-4">
                                    {course.quizzes.map((quiz) => (
                                        <div key={quiz._id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                                                <p className="text-xs text-gray-500">{quiz.questions?.length || 0} Questions</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedQuizId(quiz._id);
                                                        setShowQuizBuilder(true);
                                                    }}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                                {/* <button className="p-2 text-red-600 hover:bg-red-100 rounded">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-500 mb-2">No quizzes yet.</p>
                                    <button
                                        onClick={() => {
                                            setSelectedQuizId(null);
                                            setShowQuizBuilder(true);
                                        }}
                                        className="text-indigo-600 font-medium hover:text-indigo-800"
                                    >
                                        Create your first quiz
                                    </button>
                                </div>
                            )}
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

            {/* Quiz Builder Modal */}
            {showQuizBuilder && (
                <QuizBuilder
                    courseId={id}
                    quizId={selectedQuizId}
                    onClose={() => setShowQuizBuilder(false)}
                    onSave={async () => {
                        setShowQuizBuilder(false);
                        await fetchCourse(); // Refresh course data to show new quiz
                    }}
                />
            )}

            {/* Content Upload Wizard */}
            <ContentUploadWizard
                isOpen={showContentWizard}
                onClose={() => setShowContentWizard(false)}
                onSubmit={handleCreateLesson}
                contentType={selectedContentType}
                courseId={id}
            />
        </div>
    );
};

export default EditCourse;
