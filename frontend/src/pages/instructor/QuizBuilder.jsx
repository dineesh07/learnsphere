import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { GripVertical } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// import quizService from '../../services/quizService'; // Need to implement this

// Mock service if not exists, but better to use real one. 
// Assuming api link.
import api from '../../lib/axios';

const QuizBuilder = ({ courseId, quizId, onClose, onSave }) => {
    // If quizId is provided, we edit. If not, create new.
    // This component will be displayed as a full screen or large modal.

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            questions: [
                { questionText: '', points: 1, options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] }
            ],
            rewards: {
                firstAttempt: 10,
                secondAttempt: 7,
                thirdAttempt: 5,
                moreAttempts: 2
            }
        }
    });

    const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
        control,
        name: "questions"
    });

    // Helper for options within a question - functionality bit complex with nested FieldArray.
    // Simplified: We render options mapping manually or simple fixed 4 options or dynamic.
    // Let's use a sub-component for Question to handle its own options? 
    // Or just simple map inside map.

    const [loading, setLoading] = useState(false);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [showRewards, setShowRewards] = useState(false);

    useEffect(() => {
        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            const res = await api.get(`/courses/${courseId}/quizzes/${quizId}`);
            reset(res.data.data);
        } catch (error) {
            toast.error("Failed to load quiz");
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const payload = { ...data, course: courseId };
            let res;
            if (quizId) {
                res = await api.put(`/courses/${courseId}/quizzes/${quizId}`, payload);
                toast.success("Quiz updated!");
            } else {
                res = await api.post(`/courses/${courseId}/quizzes`, payload);
                toast.success("Quiz created!");
            }
            if (onSave) onSave(res.data.data);
            if (onClose) onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save quiz");
        } finally {
            setLoading(false);
        }
    };

    // Sub-component for options list of a specific question
    const OptionsEditor = ({ questionIndex }) => {
        const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
            control,
            name: `questions.${questionIndex}.options`
        });

        return (
            <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Choices</label>
                {optionFields.map((field, k) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register(`questions.${questionIndex}.options.${k}.isCorrect`)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <input
                            {...register(`questions.${questionIndex}.options.${k}.text`, { required: true })}
                            placeholder={`Option ${k + 1}`}
                            className="flex-1 block w-full border-gray-300 rounded-md border p-2 text-sm"
                        />
                        <button type="button" onClick={() => removeOption(k)} className="text-gray-400 hover:text-red-500">
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => appendOption({ text: '', isCorrect: false })}
                    className="text-sm text-indigo-600 hover:text-indigo-900 font-medium flex items-center mt-2"
                >
                    <PlusIcon className="h-4 w-4 mr-1" /> Add choice
                </button>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-6xl rounded-xl shadow-2xl flex flex-col h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
                    <input
                        {...register('title', { required: "Quiz Title is required" })}
                        placeholder="Quiz Title"
                        className="text-xl font-bold bg-transparent border-none focus:ring-0 w-1/2 placeholder-gray-400"
                    />
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowRewards(true)}
                            className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200"
                        >
                            Rewards Config
                        </button>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                            {loading ? 'Saving...' : 'Save Quiz'}
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel: Question List */}
                    <div className="w-1/4 border-r bg-gray-50 overflow-y-auto p-4 flex flex-col">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Questions</h3>
                        <div className="space-y-2 flex-1">
                            {questionFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    onClick={() => setActiveQuestionIndex(index)}
                                    className={`p-3 rounded-lg cursor-pointer border flex justify-between items-center group ${index === activeQuestionIndex ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center truncate">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 ${index === activeQuestionIndex ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <span className="truncate text-sm font-medium text-gray-700">
                                            {/* We can't easily access values here without watching, so just say Question X */}
                                            Question {index + 1}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeQuestion(index); }}
                                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                appendQuestion({ questionText: '', points: 1, options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] });
                                setActiveQuestionIndex(questionFields.length);
                            }}
                            className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Question
                        </button>
                    </div>

                    {/* Right Panel: Editor */}
                    <div className="flex-1 overflow-y-auto p-8 bg-white">
                        {questionFields.length > 0 && activeQuestionIndex < questionFields.length ? (
                            <div className="max-w-2xl mx-auto">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">
                                    Question {activeQuestionIndex + 1} of {questionFields.length}
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                                        <textarea
                                            {...register(`questions.${activeQuestionIndex}.questionText`, { required: "Question text is required" })}
                                            rows={3}
                                            className="block w-full border-gray-300 rounded-md border p-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Write your question here..."
                                        />
                                        {errors.questions?.[activeQuestionIndex]?.questionText && (
                                            <p className="mt-1 text-sm text-red-600">Question text is required</p>
                                        )}
                                    </div>

                                    <OptionsEditor questionIndex={activeQuestionIndex} />

                                    <div className="pt-4 border-t">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Points for this question</label>
                                        <input
                                            type="number"
                                            {...register(`questions.${activeQuestionIndex}.points`)}
                                            className="w-24 border p-2 rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p>Select a question or add a new one.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rewards Modal */}
                {showRewards && (
                    <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                            <h3 className="text-lg font-bold mb-4">Quiz Rewards</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm text-gray-700">1st Attempt Points</label>
                                    <input type="number" {...register('rewards.firstAttempt')} className="w-20 border rounded p-1" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="text-sm text-gray-700">2nd Attempt Points</label>
                                    <input type="number" {...register('rewards.secondAttempt')} className="w-20 border rounded p-1" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="text-sm text-gray-700">3rd Attempt Points</label>
                                    <input type="number" {...register('rewards.thirdAttempt')} className="w-20 border rounded p-1" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="text-sm text-gray-700">4th+ Attempt Points</label>
                                    <input type="number" {...register('rewards.moreAttempts')} className="w-20 border rounded p-1" />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button onClick={() => setShowRewards(false)} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">Done</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizBuilder;
