import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import courseService from '../services/courseService';
import toast from 'react-hot-toast';
import { Tab } from '@headlessui/react';
import { PlusIcon, TrashIcon, PaperClipIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const LessonForm = ({ courseId, onSuccess, onCancel, initialData = null }) => {
    const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: initialData || { type: 'video', order: 1, attachments: [] }
    });

    const { fields: attachmentFields, append, remove } = useFieldArray({
        control,
        name: "attachments"
    });

    const [loading, setLoading] = useState(false);
    const type = watch('type');

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (initialData) {
                toast.error("Edit not implemented fully in this MVP");
                // Implement update logic here
            } else {
                await courseService.addLesson(courseId, data);
                toast.success('Lesson saved');
                onSuccess();
            }
        } catch (error) {
            toast.error('Failed to save lesson');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">{initialData ? 'Edit Content' : 'Add New Content'}</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-xl bg-indigo-900/10 p-1 mb-6">
                        {['Content', 'Description', 'Attachments'].map((category) => (
                            <Tab
                                key={category}
                                className={({ selected }) =>
                                    classNames(
                                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all outline-none',
                                        selected
                                            ? 'bg-white text-indigo-700 shadow ring-1 ring-black/5'
                                            : 'text-indigo-600 hover:bg-white/[0.12] hover:text-indigo-800'
                                    )
                                }
                            >
                                {category}
                            </Tab>
                        ))}
                    </Tab.List>

                    <Tab.Panels className="mt-2 text-gray-700">
                        {/* Content Tab */}
                        <Tab.Panel className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content Title</label>
                                <input
                                    {...register('title', { required: "Title is required" })}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2.5"
                                    placeholder="e.g., Introduction to Hooks"
                                />
                                {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        {...register('type')}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2.5"
                                    >
                                        <option value="video">Video</option>
                                        <option value="document">Document</option>
                                        <option value="image">Image</option>
                                        <option value="quiz">Quiz Links</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                    <input
                                        type="number"
                                        {...register('order')}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2.5"
                                    />
                                </div>
                            </div>

                            {type === 'video' && (
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <label className="block text-sm font-medium text-indigo-900 mb-1">Video Link (YouTube/Drive)</label>
                                    <input
                                        {...register('videoUrl', { required: type === 'video' })}
                                        className="block w-full border-indigo-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2.5"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            )}

                            {(type === 'document' || type === 'image') && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-center">
                                    <PaperClipIcon className="mx-auto h-8 w-8 text-gray-400" />
                                    <label className="block text-sm font-medium text-gray-700 mt-2">File Upload</label>
                                    <input
                                        {...register('fileUrl')}
                                        className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        placeholder="Paste URL for MVP..."
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Accepts PDF, JPG, PNG</p>
                                </div>
                            )}
                        </Tab.Panel>

                        {/* Description Tab */}
                        <Tab.Panel>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={6}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-3"
                                    placeholder="Write your content description here..."
                                />
                            </div>
                        </Tab.Panel>

                        {/* Attachments Tab */}
                        <Tab.Panel>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Additional Resources</label>
                                    <button
                                        type="button"
                                        onClick={() => append({ title: '', url: '', type: 'link' })}
                                        className="text-xs flex items-center bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100"
                                    >
                                        <PlusIcon className="h-3 w-3 mr-1" /> Add
                                    </button>
                                </div>

                                {attachmentFields.length === 0 && (
                                    <p className="text-sm text-gray-400 italic text-center py-4">No attachments added.</p>
                                )}

                                {attachmentFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2 items-start bg-gray-50 p-2 rounded border border-gray-200">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                {...register(`attachments.${index}.title`, { required: true })}
                                                placeholder="Resource Title"
                                                className="block w-full border-gray-300 rounded text-sm border p-1.5"
                                            />
                                            <div className="flex gap-2">
                                                <select
                                                    {...register(`attachments.${index}.type`)}
                                                    className="w-24 border-gray-300 rounded text-sm border p-1.5"
                                                >
                                                    <option value="link">Link</option>
                                                    <option value="file">File</option>
                                                </select>
                                                <input
                                                    {...register(`attachments.${index}.url`, { required: true })}
                                                    placeholder="URL"
                                                    className="flex-1 border-gray-300 rounded text-sm border p-1.5"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-gray-400 hover:text-red-500 p-1"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Saving...' : 'Save & Close'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LessonForm;
