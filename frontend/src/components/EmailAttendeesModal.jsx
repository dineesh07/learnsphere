import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Mail, X } from 'lucide-react';
import toast from 'react-hot-toast';
import courseService from '../services/courseService';

export default function EmailAttendeesModal({ isOpen, onClose, course }) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [recipients, setRecipients] = useState('all'); // 'all' or specific IDs

    const handleSend = async (e) => {
        e.preventDefault();

        if (!subject.trim() || !message.trim()) {
            toast.error('Please fill in both subject and message');
            return;
        }

        setSending(true);
        try {
            await courseService.emailCourseAttendees(course._id, {
                subject,
                message,
                recipients
            });

            toast.success('Email sent successfully!');
            setSubject('');
            setMessage('');
            onClose();
        } catch (error) {
            console.error('Failed to send email:', error);
            toast.error(error.response?.data?.error || 'Failed to send email');
        } finally {
            setSending(false);
        }
    };

    const handleClose = () => {
        if (!sending) {
            setSubject('');
            setMessage('');
            onClose();
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <Mail className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <Dialog.Title className="text-xl font-bold text-gray-900">
                                                Email Course Attendees
                                            </Dialog.Title>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {course?.title}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        disabled={sending}
                                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSend} className="space-y-4">
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="Enter email subject..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            disabled={sending}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type your message here..."
                                            rows={8}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                                            disabled={sending}
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            This message will be sent to all enrolled students.
                                        </p>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            disabled={sending}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {sending ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="w-4 h-4" />
                                                    Send Email
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
