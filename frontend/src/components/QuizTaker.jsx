import { useState, useEffect } from 'react';
import quizService from '../services/quizService';
import toast from 'react-hot-toast';

const QuizTaker = ({ courseId, quizId, onComplete }) => {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({}); // { questionId: optionId }
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (quizId) fetchQuiz();
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            const res = await quizService.getQuiz(courseId, quizId);
            setQuiz(res.data);
        } catch (error) {
            toast.error('Failed to load quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers({ ...answers, [questionId]: optionId });
    };

    const handleSubmit = async () => {
        // Format answers for backend: [{ questionId, selectedOption: optionId }]
        const formattedAnswers = Object.keys(answers).map(qId => ({
            questionId: qId,
            selectedOption: answers[qId]
        }));

        try {
            const res = await quizService.submitAttempt(courseId, quizId, { answers: formattedAnswers });
            setResult(res.data); // data is attempt format needs checking
            // Backend returns: { success: true, data: attempt, pointsEarned, badge }
            // Let's use res.pointsEarned directly
            toast.success(`Quiz Submitted! Score: ${res.data.score}/${quiz.questions.length}`);
            if (onComplete) onComplete(res.data);
        } catch (error) {
            toast.error('Failed to submit quiz');
        }
    };

    if (loading) return <div className="p-4 text-center">Loading Quiz...</div>;
    if (!quiz) return <div className="p-4 text-center">Quiz not found</div>;

    if (result) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto text-center">
                <div className="mb-6">
                    <div className="inline-block p-4 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                        <span className="text-4xl font-bold">{result.score}</span>
                        <span className="text-gray-400 text-xl">/{quiz.questions.length}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {result.score >= (quiz.questions.length / 2) ? "Great Job!" : "Keep Trying!"}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        You earned <span className="font-bold text-indigo-600">{result.pointsEarned || 0}</span> points.
                    </p>
                </div>
                <button
                    onClick={onComplete}
                    className="bg-indigo-600 text-white px-8 py-2 rounded-full hover:bg-indigo-700 transition"
                >
                    Continue Course
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">{quiz.title}</h2>

            <div className="space-y-8">
                {quiz.questions.map((q, index) => (
                    <div key={q._id} className="pb-6">
                        <p className="font-medium text-lg mb-4 text-gray-900">
                            {index + 1}. {q.questionText}
                        </p>
                        <div className="space-y-3 pl-4">
                            {q.options.map((option) => (
                                <label
                                    key={option._id}
                                    className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all ${answers[q._id] === option._id
                                            ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                                            : 'hover:bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${q._id}`}
                                        value={option._id}
                                        checked={answers[q._id] === option._id}
                                        onChange={() => handleOptionSelect(q._id, option._id)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                    />
                                    <span className="text-gray-700">{option.text}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end pt-4 border-t">
                <button
                    onClick={handleSubmit}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                    disabled={Object.keys(answers).length < quiz.questions.length}
                >
                    Submit Answers
                </button>
            </div>
        </div>
    );
};

export default QuizTaker;
