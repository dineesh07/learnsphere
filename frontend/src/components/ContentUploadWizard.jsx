import { useState, useEffect } from 'react';
import { XMarkIcon, CloudArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ContentUploadWizard = ({ isOpen, onClose, onSubmit, contentType, courseId }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: contentType || 'video',
        videoUrl: '',
        fileUrl: '',
        duration: 0,
        allowDownload: true,
        responsiblePerson: '',
        additionalAttachments: []
    });

    const [uploadMethod, setUploadMethod] = useState('link'); // 'link' or 'file'
    const [uploading, setUploading] = useState(false);

    // Update form type when contentType prop changes
    useEffect(() => {
        if (contentType) {
            setFormData(prev => ({ ...prev, type: contentType }));
        }
    }, [contentType]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            // TODO: Implement actual file upload to your backend
            // const response = await uploadService.uploadFile(formDataUpload);
            // setFormData(prev => ({ ...prev, fileUrl: response.data.url }));
            toast.success('File uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title) {
            toast.error('Please enter a title');
            return;
        }

        if (formData.type === 'video' && !formData.videoUrl) {
            toast.error('Please enter a video URL');
            return;
        }

        onSubmit(formData);

        // Reset form after submission
        setFormData({
            title: '',
            description: '',
            type: contentType || 'video',
            videoUrl: '',
            fileUrl: '',
            duration: 0,
            allowDownload: true,
            responsiblePerson: '',
            additionalAttachments: []
        });
        setUploadMethod('link');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-white">
                                Add {contentType?.charAt(0).toUpperCase() + contentType?.slice(1)} Content
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-4">
                        {/* Title */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter content title"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Write your content description here..."
                            />
                        </div>

                        {/* Content Type Specific Fields */}
                        {contentType === 'video' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video Source *
                                </label>

                                {/* Upload method toggle */}
                                <div className="flex gap-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setUploadMethod('file')}
                                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${uploadMethod === 'file'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <CloudArrowUpIcon className="w-5 h-5 inline mr-2" />
                                        Upload Video
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadMethod('link')}
                                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${uploadMethod === 'link'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <LinkIcon className="w-5 h-5 inline mr-2" />
                                        External Link
                                    </button>
                                </div>

                                {uploadMethod === 'file' ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                                        <input
                                            type="file"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;

                                                setUploading(true);
                                                const formDataUpload = new FormData();
                                                formDataUpload.append('file', file);

                                                try {
                                                    const { default: uploadService } = await import('../services/uploadService');
                                                    const response = await uploadService.uploadFile(formDataUpload);
                                                    setFormData(prev => ({ ...prev, videoUrl: response.data.path }));
                                                    toast.success('Video uploaded successfully');
                                                } catch (error) {
                                                    console.error('Upload failed:', error);
                                                    toast.error('Failed to upload video');
                                                } finally {
                                                    setUploading(false);
                                                }
                                            }}
                                            className="hidden"
                                            id="video-upload"
                                            accept="video/mp4,video/mkv,video/webm"
                                        />
                                        <label
                                            htmlFor="video-upload"
                                            className="cursor-pointer"
                                        >
                                            <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                            {formData.videoUrl && !formData.videoUrl.startsWith('http') ? (
                                                <div>
                                                    <p className="text-green-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-xs mx-auto">
                                                        {formData.videoUrl.split('/').pop()}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-gray-600">
                                                        Click to upload video file
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        MP4, MKV up to 100MB
                                                    </p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <input
                                            type="url"
                                            name="videoUrl"
                                            value={formData.videoUrl || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., https://www.youtube.com/watch?v=..."
                                        />
                                        <p className="text-xs text-blue-600">
                                            (YouTube, Vimeo, or generic video URL)
                                        </p>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="00:00"
                                        min="0"
                                    />
                                </div>
                            </div>
                        )}

                        {(contentType === 'document' || contentType === 'image') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {contentType === 'image' ? 'Image file' : 'Document file'}
                                </label>

                                {/* Upload method toggle */}
                                <div className="flex gap-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setUploadMethod('file')}
                                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${uploadMethod === 'file'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <CloudArrowUpIcon className="w-5 h-5 inline mr-2" />
                                        Upload {contentType === 'image' ? 'image' : 'file'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadMethod('link')}
                                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${uploadMethod === 'link'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <LinkIcon className="w-5 h-5 inline mr-2" />
                                        Link
                                    </button>
                                </div>

                                {uploadMethod === 'file' ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                            accept={contentType === 'image' ? 'image/*' : '.pdf,.doc,.docx,.ppt,.pptx'}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer"
                                        >
                                            <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {contentType === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'PDF, DOC, PPT up to 50MB'}
                                            </p>
                                        </label>
                                    </div>
                                ) : (
                                    <input
                                        type="url"
                                        name="fileUrl"
                                        value={formData.fileUrl}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., www.google.com"
                                    />
                                )}
                            </div>
                        )}

                        {/* Allow Download Toggle */}
                        <div className="mb-4 flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                                Allow Download:
                            </label>
                            <input
                                type="checkbox"
                                name="allowDownload"
                                checked={formData.allowDownload}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Add Content'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContentUploadWizard;
