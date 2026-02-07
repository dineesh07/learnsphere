import { VideoCameraIcon, DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline';

const ContentTypeSelector = ({ selected, onChange }) => {
    const contentTypes = [
        {
            id: 'video',
            label: 'Video',
            icon: VideoCameraIcon,
            color: 'bg-purple-100 text-purple-700 border-purple-300',
            selectedColor: 'bg-purple-500 text-white border-purple-600'
        },
        {
            id: 'document',
            label: 'Document',
            icon: DocumentTextIcon,
            color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
            selectedColor: 'bg-indigo-500 text-white border-indigo-600'
        },
        {
            id: 'image',
            label: 'Image',
            icon: PhotoIcon,
            color: 'bg-gray-100 text-gray-700 border-gray-300',
            selectedColor: 'bg-gray-500 text-white border-gray-600'
        }
    ];

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Content Category
            </label>
            <div className="grid grid-cols-3 gap-4">
                {contentTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selected === type.id;

                    return (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => onChange(type.id)}
                            className={`
                                flex flex-col items-center justify-center p-4 rounded-lg border-2
                                transition-all duration-200 hover:scale-105
                                ${isSelected ? type.selectedColor : type.color}
                            `}
                        >
                            <Icon className="w-8 h-8 mb-2" />
                            <span className="text-sm font-medium">{type.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ContentTypeSelector;
