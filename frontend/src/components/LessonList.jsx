import { useState } from 'react';
import LessonForm from './LessonForm';
import { Pencil, Trash2 } from 'lucide-react'; // Ensure lucide-react (or heroicons) installed
// I used Lucide in app layout.

const LessonList = ({ courseId, lessons, onRefresh }) => {
    const [editingLessonId, setEditingLessonId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const handleEdit = (lesson) => {
        // setEditingLessonId(lesson._id);
        alert("Edit not implemented in this MVP view");
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure?")) {
            // call api
            // courseService.deleteLesson(id)...
            alert("Delete not implemented in this MVP view");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Lessons</h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                >
                    + Add Content
                </button>
            </div>

            {showAddForm && (
                <LessonForm
                    courseId={courseId}
                    onSuccess={() => { setShowAddForm(false); onRefresh(); }}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            <div className="space-y-2">
                {lessons && lessons.length > 0 ? (
                    lessons.map((lesson) => (
                        <div key={lesson._id} className="border p-4 rounded bg-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded uppercase">{lesson.type}</span>
                                <span className="font-medium">{lesson.title}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(lesson)} className="p-1 text-gray-500 hover:text-blue-600">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(lesson._id)} className="p-1 text-gray-500 hover:text-red-600">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    !showAddForm && <div className="text-center py-8 text-gray-500">No content added yet.</div>
                )}
            </div>
        </div>
    );
};

export default LessonList;
