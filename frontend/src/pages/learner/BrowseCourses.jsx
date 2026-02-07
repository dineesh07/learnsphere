import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import { Search, Filter, BookOpen, Clock, Users } from 'lucide-react';

const BrowseCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, popular, new

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            // Fetch all published courses
            // TODO: Add backend support for publishing filter if not already default
            const data = await courseService.getCourses();
            // Client side filtering for published only if backend returns all
            const publishedCourses = data.data.filter(c => c.published);
            setCourses(publishedCourses);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="bg-indigo-600 rounded-2xl p-8 mb-10 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-4">Expand Your Knowledge</h1>
                    <p className="text-indigo-100 text-lg max-w-2xl mb-8">
                        Discover top-rated courses in programming, design, business, and more.
                        Start learning today with LearnSphere.
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-lg shadow-lg max-w-xl flex items-center">
                        <Search className="text-gray-400 ml-2" />
                        <input
                            type="text"
                            placeholder="Search for courses..."
                            className="flex-1 p-2 outline-none text-gray-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition">
                            Search
                        </button>
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-indigo-700 rounded-full opacity-50 blur-3xl"></div>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">All Courses</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['all', 'popular', 'new'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filter === f ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                                {/* Image */}
                                <div className="h-48 bg-gray-200 rounded-t-xl overflow-hidden relative">
                                    {course.image && course.image !== 'no-photo.jpg' ? (
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                                            <BookOpen size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-indigo-600 shadow-sm">
                                        {course.price > 0 ? `₹${course.price}` : 'Free'}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2 text-xs font-medium text-indigo-600">
                                        <span className="bg-indigo-50 px-2 py-0.5 rounded">Development</span>
                                        <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded">Beginner</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                        {course.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                                        {course.description || "No description available for this course."}
                                    </p>

                                    {/* Instructor & Stats */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-50 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {course.instructor?.name?.charAt(0) || 'I'}
                                            </div>
                                            <span className="truncate max-w-[100px]">{course.instructor?.name || 'Instructor'}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1"><Users size={14} /> 120</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> 2h</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="p-4 pt-0">
                                    <Link
                                        to={`/courses/${course._id}`}
                                        className="block w-full text-center py-2.5 bg-gray-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 hover:border-transparent"
                                    >
                                        View Course
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-20 text-gray-500">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
                            <p>Try adjusting your search terms.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BrowseCourses;
