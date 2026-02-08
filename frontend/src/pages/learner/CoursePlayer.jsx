import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import progressService from '../../services/progressService';
import QuizTaker from '../../components/QuizTaker';
import { ChevronLeft, ChevronRight, CheckCircle, PlayCircle, FileText, HelpCircle, Menu } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomVideoPlayer from '../../components/CustomVideoPlayer';

const CoursePlayer = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            // Fetch course first
            const courseRes = await courseService.getCourse(id);
            setCourse(courseRes.data);

            // Try to fetch progress, but don't fail if it errors
            try {
                const progressRes = await progressService.getProgress(id);
                setProgress(progressRes.data);
            } catch (progressError) {
                console.warn('Failed to load progress, continuing without it:', progressError);
                toast.error("Could not load progress tracking");
                // Set empty progress so UI doesn't break
                setProgress({ completedLessons: [], percentCompleted: 0 });
            }

            // Set active lesson
            if (courseRes.data.lessons && courseRes.data.lessons.length > 0) {
                const completed = progress?.completedLessons || [];
                const nextLesson = courseRes.data.lessons.find(l => !completed.includes(l._id));
                setActiveLesson(nextLesson || courseRes.data.lessons[0]);
            }
        } catch (error) {
            console.error('Failed to load course:', error);
            toast.error("Failed to load course");
        } finally {
            setLoading(false);
        }
    };

    // Debug: Log course and activeLesson
    useEffect(() => {
        if (course) console.log('Course Loaded:', course);
        if (activeLesson) console.log('Active Lesson:', activeLesson);
    }, [course, activeLesson]);

    const markLessonComplete = async () => {
        if (!activeLesson) return;
        try {
            await progressService.updateProgress(id, { lessonId: activeLesson._id });
            toast.success("Lesson Completed!");

            const res = await progressService.getProgress(id);
            setProgress(res.data);
            handleNext();
        } catch (error) {
            toast.error("Failed to update progress");
        }
    };

    const handleNext = () => {
        const currentIndex = course.lessons.findIndex(l => l._id === activeLesson._id);
        if (currentIndex < course.lessons.length - 1) {
            setActiveLesson(course.lessons[currentIndex + 1]);
        }
    };

    const handlePrev = () => {
        const currentIndex = course.lessons.findIndex(l => l._id === activeLesson._id);
        if (currentIndex > 0) {
            setActiveLesson(course.lessons[currentIndex - 1]);
        }
    };

    const handleQuizComplete = async (resultData) => {
        // QuizTaker handles submission. We just update progress here?
        // Actually markLessonComplete handles progress update for the lesson.
        // But QuizTaker might have already recorded the attempt.
        // We should also mark the lesson as complete in progress tracking.
        await markLessonComplete();
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-indigo-600">Loading Player...</div>;
    if (!course) return <div className="flex h-screen items-center justify-center">Course not found</div>;

    // Helper: Find linked Quiz ID if lesson type is quiz
    // Strategy: Look in course.quizzes for a quiz that has lesson == activeLesson._id
    // Note: Backend must populate 'quizzes' and Quiz model must have 'lesson' field.
    const activeQuiz = course.quizzes?.find(q => q.lesson === activeLesson._id);


    // Helper function to get YouTube embed URL
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;

        const params = '?rel=0&modestbranding=1&iv_load_policy=3&fs=0';

        // Extract video ID from various YouTube URL formats
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}${params}`;
        }

        // If it's already an embed URL, return with params appended
        if (url.includes('youtube.com/embed/')) {
            const separator = url.includes('?') ? '&' : '?';
            // Avoid duplicating params if they already exist
            if (url.includes('modestbranding')) return url;
            return `${url}${separator}rel=0&modestbranding=1&iv_load_policy=3&fs=0`;
        }

        // For non-YouTube URLs, return null to fallback to regular video
        return null;
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 bg-white border-r w-80 transform transition-transform duration-300 z-20 ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
                <div className="p-4 border-b h-16 flex items-center justify-between">
                    <Link to="/my-courses" className="text-gray-500 hover:text-indigo-600 flex items-center gap-1 font-medium text-sm">
                        <ChevronLeft size={16} /> Back
                    </Link>
                    <button onClick={() => setShowMobileMenu(false)} className="md:hidden text-gray-500">
                        <ChevronLeft />
                    </button>
                </div>

                <div className="p-6 border-b bg-gray-50">
                    <h2 className="font-bold text-gray-800 line-clamp-2">{course.title}</h2>
                    <div className="mt-4">
                        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                            <span>{progress?.percentCompleted || 0}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress?.percentCompleted || 0}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-200px)]">
                    {course.lessons.map((lesson, index) => {
                        const isCompleted = progress?.completedLessons?.includes(lesson._id);
                        const isActive = activeLesson?._id === lesson._id;

                        let Icon = PlayCircle;
                        if (lesson.type === 'document') Icon = FileText;
                        if (lesson.type === 'quiz') Icon = HelpCircle;

                        return (
                            <button
                                key={lesson._id}
                                onClick={() => { setActiveLesson(lesson); setShowMobileMenu(false); }}
                                className={`w-full text-left p-4 hover:bg-gray-50 flex items-start gap-3 border-b border-gray-100 transition-colors ${isActive ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className={`mt-0.5 min-w-[20px]`}>
                                    {isCompleted ? (
                                        <CheckCircle size={20} className="text-green-500" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 text-[10px] flex items-center justify-center text-gray-400 font-bold">
                                            {index + 1}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium leading-snug ${isCompleted ? 'text-gray-500' : 'text-gray-900'}`}>{lesson.title}</p>
                                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                        <Icon size={12} />
                                        <span className="capitalize">{lesson.type}</span>
                                        {lesson.duration > 0 && <span>• {Math.floor(lesson.duration / 60)}m</span>}
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    {/* Standalone Quizzes */}
                    {course.quizzes && course.quizzes.filter(q => !q.lesson).length > 0 && (
                        <>
                            <div className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Quizzes
                            </div>
                            {course.quizzes.filter(q => !q.lesson).map((quiz, index) => (
                                <button
                                    key={quiz._id}
                                    onClick={() => {
                                        setActiveLesson({ _id: quiz._id, title: quiz.title, type: 'quiz', isStandaloneQuiz: true, quiz: quiz });
                                        setShowMobileMenu(false);
                                    }}
                                    className={`w-full text-left p-4 hover:bg-gray-50 flex items-start gap-3 border-b border-gray-100 transition-colors ${activeLesson?._id === quiz._id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                                >
                                    <div className="mt-0.5 min-w-[20px]">
                                        <HelpCircle size={20} className="text-indigo-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium leading-snug text-gray-900">{quiz.title}</p>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                            <span>{quiz.questions?.length || 0} Questions</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative">
                {/* Mobile Header */}
                <div className="md:hidden h-14 bg-white border-b flex items-center px-4">
                    <button onClick={() => setShowMobileMenu(true)} className="text-gray-600">
                        <Menu />
                    </button>
                    <span className="ml-4 font-bold truncate">{activeLesson?.title}</span>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8">
                    {activeLesson ? (
                        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">
                            {/* Lesson Header */}
                            <div className="p-6 border-b flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{activeLesson.title}</h1>
                                    <p className="text-gray-500 mt-1">{activeLesson.type === 'video' ? 'Video Lesson' : activeLesson.type === 'quiz' ? 'Knowledge Check' : 'Reading Material'}</p>
                                </div>
                            </div>

                            {/* Viewer */}
                            <div className="flex-1 bg-gray-50 relative">
                                {activeLesson.type === 'video' && (
                                    <div className="aspect-video w-full bg-black">
                                        {getYouTubeEmbedUrl(activeLesson.videoUrl) ? (
                                            <iframe
                                                src={getYouTubeEmbedUrl(activeLesson.videoUrl)}
                                                title={activeLesson.title}
                                                width="100%"
                                                height="100%"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            ></iframe>
                                        ) : (
                                            <CustomVideoPlayer
                                                src={activeLesson.videoUrl}
                                            />
                                        )}
                                    </div>
                                )}

                                {activeLesson.type === 'quiz' && (
                                    <div className="p-8">
                                        {(() => {
                                            // Check if it's a standalone quiz or lesson-linked quiz
                                            const quizToShow = activeLesson.isStandaloneQuiz ? activeLesson.quiz : activeQuiz;
                                            return quizToShow ? (
                                                <QuizTaker
                                                    courseId={id}
                                                    quizId={quizToShow._id}
                                                    onComplete={handleQuizComplete}
                                                />
                                            ) : (
                                                <div className="text-center py-20">
                                                    <HelpCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                                                    <h3 className="text-xl font-bold text-gray-400">Quiz not found</h3>
                                                    <p className="text-gray-500">The quiz for this lesson appears to be missing.</p>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {(activeLesson.type === 'document' || activeLesson.type === 'image') && (
                                    <div className="p-8 text-center h-full flex flex-col items-center justify-center">
                                        {activeLesson.type === 'image' ? (
                                            <img src={activeLesson.fileUrl} alt={activeLesson.title} className="max-h-[60vh] object-contain mx-auto shadow-lg rounded" />
                                        ) : (
                                            <div className="max-w-2xl mx-auto">
                                                <FileText className="mx-auto h-24 w-24 text-indigo-200 mb-6" />
                                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Reading Material</h3>
                                                <p className="text-gray-600 mb-8">{activeLesson.description}</p>
                                                {activeLesson.fileUrl ? (
                                                    <a
                                                        href={activeLesson.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                                    >
                                                        Open Document
                                                    </a>
                                                ) : (
                                                    <p className="text-gray-400 italic">No document attached.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer / Description */}
                            {activeLesson.type !== 'quiz' && (
                                <div className="p-8 bg-white border-t">
                                    <h3 className="text-lg font-bold mb-2">Description</h3>
                                    <div className="prose max-w-none text-gray-600">
                                        {activeLesson.description}
                                    </div>
                                    <div className="mt-8 flex justify-end">
                                        <button
                                            onClick={markLessonComplete}
                                            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-200"
                                        >
                                            Mark as Complete <CheckCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <PlayCircle className="w-16 h-16 mb-4 text-gray-200" />
                            <p className="text-xl font-medium text-gray-500">Select a lesson from the sidebar to start learning</p>
                            {course.lessons.length === 0 && (
                                <p className="text-red-400 mt-2">This course has no lessons yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
