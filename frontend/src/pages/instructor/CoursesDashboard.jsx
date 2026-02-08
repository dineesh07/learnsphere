import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import { PlusIcon, LayoutGrid, List as ListIcon, Share2, Edit2, Eye, Clock, FileText, BarChart, Play } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import CourseAnalyticsModal from '../../components/CourseAnalyticsModal';
import ContentPreviewModal from '../../components/ContentPreviewModal';

const CoursesDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all' | 'free' | 'paid'
    const [selectedTag, setSelectedTag] = useState('all'); // Tag filter
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await courseService.getCourses();
            setCourses(data.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = (courseId) => {
        const shareUrl = `${window.location.origin}/courses/${courseId}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success('Course link copied to clipboard!');
    };

    // Preview course as student would see it
    const handlePreview = (courseId) => {
        window.open(`/courses/${courseId}`, '_blank');
        toast.success('Opening course preview...');
    };

    // Show analytics modal
    const handleAnalytics = (course) => {
        setSelectedCourse(course);
        setShowAnalytics(true);
    };

    // Show content viewer modal
    const handleViewContent = (course) => {
        setSelectedCourse(course);
        setShowContent(true);
    };

    // Helper function to get full image URL
    const getImageUrl = (image) => {
        if (!image || image === 'no-photo.jpg') return null;
        // Use the API base URL (remove /api suffix) + /uploads/ + filename
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const serverUrl = baseUrl.replace('/api', '');
        return `${serverUrl}/uploads/${image}`;
    };

    // Available tags for filtering
    const availableTags = ['all', 'beginner', 'intermediate', 'advanced', 'developer', 'designer', 'web-dev', 'mobile-dev', 'data-science', 'business'];

    // Filter and search courses
    const filteredCourses = courses.filter(course => {
        // Search filter
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());

        // Type filter
        let matchesType = true;
        if (filterType === 'free') {
            matchesType = course.accessRule === 'open';
        } else if (filterType === 'paid') {
            matchesType = course.accessRule === 'payment';
        }

        // Tag filter
        let matchesTag = true;
        if (selectedTag !== 'all') {
            matchesTag = course.tags && course.tags.includes(selectedTag);
        }

        return matchesSearch && matchesType && matchesTag;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                    <p className="text-gray-500 mt-1">Manage, publish, and track your courses</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={clsx(
                                "p-2 rounded-md transition-all",
                                viewMode === 'kanban' ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={clsx(
                                "p-2 rounded-md transition-all",
                                viewMode === 'list' ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <ListIcon size={20} />
                        </button>
                    </div>

                    <Link
                        to="/instructor/courses/new"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Create Course
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search courses by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterType('all')}
                        className={clsx(
                            "px-4 py-2 rounded-lg font-medium transition-all",
                            filterType === 'all'
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        All Courses
                    </button>
                    <button
                        onClick={() => setFilterType('free')}
                        className={clsx(
                            "px-4 py-2 rounded-lg font-medium transition-all",
                            filterType === 'free'
                                ? "bg-green-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        Free
                    </button>
                    <button
                        onClick={() => setFilterType('paid')}
                        className={clsx(
                            "px-4 py-2 rounded-lg font-medium transition-all",
                            filterType === 'paid'
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        Paid
                    </button>
                </div>

                {/* Tag Filter Dropdown */}
                <div>
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white font-medium text-gray-700"
                    >
                        {availableTags.map(tag => (
                            <option key={tag} value={tag}>
                                {tag === 'all' ? 'All Tags' : tag.split('-').map(word =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <>
                    {filteredCourses.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            {courses.length === 0 ? (
                                <>
                                    <h3 className="text-lg font-medium text-gray-900">No courses yet</h3>
                                    <p className="mt-1 text-gray-500">Get started by creating your first course.</p>
                                    <div className="mt-6">
                                        <Link
                                            to="/instructor/courses/new"
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                            Create New Course
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-medium text-gray-900">No courses match your filters</h3>
                                    <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            {viewMode === 'kanban' ? (
                                /* Kanban / Grid View */
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredCourses.map((course) => (
                                        <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
                                            {/* Card Header & Image */}
                                            <div className="relative h-40 bg-gray-100 rounded-t-xl overflow-hidden group">
                                                {getImageUrl(course.image) ? (
                                                    <img src={getImageUrl(course.image)} alt={course.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                                                        <FileText size={48} />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2">
                                                    <span className={clsx(
                                                        "px-2 py-1 rounded-full text-xs font-semibold shadow-sm",
                                                        course.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    )}>
                                                        {course.published ? 'Published' : 'Draft'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h2>

                                                {/* Course Tags */}
                                                {course.tags && course.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {course.tags.map(tag => (
                                                            <span key={tag} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
                                                                {tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="mt-auto grid grid-cols-2 gap-4 text-sm text-gray-500 border-t pt-4">
                                                    <div className="flex items-center">
                                                        <Eye size={16} className="mr-1.5" />
                                                        <span>{course.viewsCount || 0} Views</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FileText size={16} className="mr-1.5" />
                                                        <span>{course.lessonsCount || 0} Contents</span>
                                                    </div>
                                                    <div className="flex items-center col-span-2">
                                                        <Clock size={16} className="mr-1.5" />
                                                        <span>{Math.round((course.totalDuration || 0) / 60)}h {(course.totalDuration || 0) % 60}m Duration</span>
                                                    </div>
                                                    {course.accessRule === 'payment' && course.price && (
                                                        <div className="flex items-center col-span-2">
                                                            <span className="text-indigo-600 font-semibold">₹{course.price}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Card Actions */}
                                            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 rounded-b-xl flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    {course.published && (
                                                        <span className="flex h-3 w-3 relative">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                        </span>
                                                    )}
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {course.published ? 'Live' : 'Hidden'}
                                                    </span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handlePreview(course._id)}
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                        title="Preview Course"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAnalytics(course)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="View Analytics"
                                                    >
                                                        <BarChart size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewContent(course)}
                                                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                                                        title="View Content"
                                                    >
                                                        <Play size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare(course._id)}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                                        title="Share"
                                                    >
                                                        <Share2 size={18} />
                                                    </button>
                                                    <Link
                                                        to={`/instructor/courses/${course._id}/edit`}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* List / Table View */
                                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Course
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Stats
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Duration
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredCourses.map((course) => (
                                                <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                                                {getImageUrl(course.image) ? (
                                                                    <img className="h-10 w-10 object-cover" src={getImageUrl(course.image)} alt="" />
                                                                ) : (
                                                                    <FileText className="h-6 w-6 m-2 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    {['React', 'Web'].join(', ')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 flex flex-col gap-1">
                                                            <span className="flex items-center gap-1"><Eye size={14} /> {course.viewsCount || 0}</span>
                                                            <span className="flex items-center gap-1"><FileText size={14} /> {course.lessonsCount || 0}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {Math.round((course.totalDuration || 0) / 60)}h {(course.totalDuration || 0) % 60}m
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={clsx(
                                                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                                            course.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        )}>
                                                            {course.published ? 'Published' : 'Draft'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-3">
                                                            <button
                                                                onClick={() => handleShare(course._id)}
                                                                className="text-gray-400 hover:text-indigo-600"
                                                            >
                                                                <Share2 size={18} />
                                                            </button>
                                                            <Link to={`/instructor/courses/${course._id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                                                                <Edit2 size={18} />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {/* Modals */}
            <CourseAnalyticsModal
                isOpen={showAnalytics}
                onClose={() => setShowAnalytics(false)}
                course={selectedCourse}
            />
            <ContentPreviewModal
                isOpen={showContent}
                onClose={() => setShowContent(false)}
                course={selectedCourse}
            />
        </div>
    );
};

export default CoursesDashboard;
