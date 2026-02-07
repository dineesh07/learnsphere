
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import { PlayCircle, Clock, Award } from 'lucide-react';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const fetchEnrolledCourses = async () => {
        try {
            // Mock: Get all courses and pretend we are enrolled in the first few
            const res = await courseService.getCourses();
            // Take first 3 for demo as "Enrolled"
            setCourses(res.data.slice(0, 3));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">My Learning</h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <>
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map(course => (
                                <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                                    <div className="relative h-48">
                                        {course.image && course.image !== 'no-photo.jpg' ? (
                                            <img src={course.image} className="w-full h-full object-cover" alt={course.title} />
                                        ) : (
                                            <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                                                <PlayCircle className="text-indigo-300 w-16 h-16" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <Link to={`/courses/${course._id}`} className="bg-white/90 text-indigo-600 px-6 py-2 rounded-full font-bold hover:bg-white">
                                                Resume
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1">{course.title}</h3>

                                        {/* Progress Bar Mock */}
                                        <div className="mt-auto">
                                            <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                                                <span>65% Complete</span>
                                                <span>4/12 Lessons</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                                            </div>

                                            <Link
                                                to={`/courses/${course._id}`}
                                                className="block w-full text-center py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors"
                                            >
                                                Continue Learning
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <Award className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">You haven't enrolled in any courses yet.</h3>
                            <div className="mt-6">
                                <Link to="/browse" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                                    Browse Courses
                                </Link>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyCourses;
// Note: Ideally /courses/:id should go to Course Player if enrolled, or Course Description if not.
// For now, direct to Course Player.
