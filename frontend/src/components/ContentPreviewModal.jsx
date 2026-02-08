import { X, Play, FileText, Download, Clock } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import courseService from '../services/courseService';
import CustomVideoPlayer from './CustomVideoPlayer';

export default function ContentPreviewModal({ isOpen, onClose, course }) {
    const [courseDetails, setCourseDetails] = useState(null);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (isOpen && course) {
            fetchCourseDetails();
        }
    }, [isOpen, course]);

    const fetchCourseDetails = async () => {
        setLoading(true);
        try {
            const response = await courseService.getCourse(course._id);
            setCourseDetails(response.data);
        } catch (error) {
            console.error('Failed to fetch course details:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-start justify-between p-6 border-b border-gray-200">
                                    <div>
                                        <Dialog.Title className="text-2xl font-bold text-gray-900">
                                            Course Content
                                        </Dialog.Title>
                                        <p className="mt-1 text-sm text-gray-500">{course?.title}</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 max-h-[60vh] overflow-y-auto">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                        </div>
                                    ) : courseDetails?.lessons?.length > 0 ? (
                                        <div className="space-y-3">
                                            {courseDetails.lessons.map((lesson, index) => (
                                                <div
                                                    key={lesson._id || index}
                                                    className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        {/* Lesson Number */}
                                                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                                            {index + 1}
                                                        </div>

                                                        {/* Lesson Details */}
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                                {lesson.title}
                                                            </h3>
                                                            {lesson.description && (
                                                                <p className="text-sm text-gray-600 mb-2">
                                                                    {lesson.description}
                                                                </p>
                                                            )}

                                                            {/* Lesson Metadata */}
                                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                {lesson.duration && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock size={14} />
                                                                        <span>{lesson.duration} min</span>
                                                                    </div>
                                                                )}
                                                                {lesson.type && (
                                                                    <div className="flex items-center gap-1">
                                                                        {lesson.type === 'video' ? (
                                                                            <>
                                                                                <Play size={14} />
                                                                                <span>Video</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FileText size={14} />
                                                                                <span>{lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}</span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Resources */}
                                                            {lesson.additionalAttachments?.length > 0 && (
                                                                <div className="mt-2 flex flex-wrap gap-2">
                                                                    {lesson.additionalAttachments.map((resource, idx) => (
                                                                        <a
                                                                            key={idx}
                                                                            href={resource.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                                                                        >
                                                                            <Download size={12} />
                                                                            {resource.name || `Resource ${idx + 1}`}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Video/Content URL */}
                                                            {lesson.type === 'video' && lesson.videoUrl && (
                                                                <div className="mt-3 aspect-video bg-black rounded-lg overflow-hidden">
                                                                    {getYouTubeEmbedUrl(lesson.videoUrl) ? (
                                                                        <iframe
                                                                            src={getYouTubeEmbedUrl(lesson.videoUrl)}
                                                                            title={lesson.title}
                                                                            width="100%"
                                                                            height="100%"
                                                                            frameBorder="0"
                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                            allowFullScreen
                                                                            className="w-full h-full"
                                                                        ></iframe>
                                                                    ) : (
                                                                        <CustomVideoPlayer
                                                                            src={lesson.videoUrl}
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}
                                                            {lesson.type === 'document' && lesson.fileUrl && (
                                                                <div className="mt-3">
                                                                    <a
                                                                        href={lesson.fileUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800"
                                                                    >
                                                                        <FileText size={16} />
                                                                        View Document
                                                                    </a>
                                                                </div>
                                                            )}
                                                            {lesson.type === 'image' && lesson.fileUrl && (
                                                                <div className="mt-3">
                                                                    <img
                                                                        src={lesson.fileUrl}
                                                                        alt={lesson.title}
                                                                        className="w-full rounded-lg"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-4 text-sm text-gray-500">
                                                No content has been added to this course yet.
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                Add lessons from the course editor.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                                    <div className="text-sm text-gray-600">
                                        {courseDetails?.lessons?.length || 0} lesson(s) • {formatDuration(course?.totalDuration || 0)}
                                    </div>
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
