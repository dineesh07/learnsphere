import { useState, useEffect } from 'react';
import { Users, Clock, Timer, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportingDashboard = () => {
    const [reportData, setReportData] = useState({
        totalParticipants: 0,
        yetToStart: 0,
        inProgress: 0,
        completed: 0,
        participants: []
    });
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [visibleColumns, setVisibleColumns] = useState({
        sno: true,
        courseName: true,
        participantName: true,
        enrolledDate: true,
        startDate: true,
        timeSpent: true,
        completionPercentage: true,
        completedDate: true,
        status: true
    });

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            const response = await fetch('/api/v1/reporting/dashboard', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setReportData(data.data);
            }
        } catch (error) {
            toast.error('Failed to load reporting data');
        } finally {
            setLoading(false);
        }
    };

    const toggleColumn = (column) => {
        setVisibleColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    const filteredParticipants = reportData.participants.filter(participant => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'yet-to-start') return participant.status === 'Yet to Start';
        if (filterStatus === 'in-progress') return participant.status === 'In progress';
        if (filterStatus === 'completed') return participant.status === 'Completed';
        return true;
    });

    const formatColumnName = (column) => {
        const names = {
            sno: 'S.No.',
            courseName: 'Course Name',
            participantName: 'Participant name',
            enrolledDate: 'Enrolled Date',
            startDate: 'Start date',
            timeSpent: 'Time spent',
            completionPercentage: 'Completion percentage',
            completedDate: 'Completed date',
            status: 'Status'
        };
        return names[column] || column;
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Yet to Start':
                return 'bg-red-100 text-red-700';
            case 'In progress':
                return 'bg-blue-100 text-blue-700';
            case 'Completed':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-400 mb-2">Reporting Dashboard</h1>
                    <p className="text-gray-400">Track participant progress across all your courses</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6 border-b border-gray-700">
                    <button className="px-4 py-2 text-green-400 border-b-2 border-green-400 font-medium">
                        Overview
                    </button>
                    <button className="px-4 py-2 text-gray-400 hover:text-gray-300">
                        Users
                    </button>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div
                        onClick={() => setFilterStatus('all')}
                        className={`bg-gray-800 p-6 rounded-lg cursor-pointer transition-all ${filterStatus === 'all' ? 'ring-2 ring-orange-500' : 'hover:bg-gray-750'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl font-bold text-orange-400 mb-2">
                                    {reportData.totalParticipants}
                                </div>
                                <div className="text-sm text-gray-400">Total Participants</div>
                            </div>
                            <Users className="w-12 h-12 text-orange-400 opacity-50" />
                        </div>
                    </div>

                    <div
                        onClick={() => setFilterStatus('yet-to-start')}
                        className={`bg-gray-800 p-6 rounded-lg cursor-pointer transition-all ${filterStatus === 'yet-to-start' ? 'ring-2 ring-red-500' : 'hover:bg-gray-750'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl font-bold text-red-400 mb-2">
                                    {reportData.yetToStart}
                                </div>
                                <div className="text-sm text-gray-400">Yet to Start</div>
                            </div>
                            <Clock className="w-12 h-12 text-red-400 opacity-50" />
                        </div>
                    </div>

                    <div
                        onClick={() => setFilterStatus('in-progress')}
                        className={`bg-gray-800 p-6 rounded-lg cursor-pointer transition-all ${filterStatus === 'in-progress' ? 'ring-2 ring-blue-500' : 'hover:bg-gray-750'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl font-bold text-blue-400 mb-2">
                                    {reportData.inProgress}
                                </div>
                                <div className="text-sm text-gray-400">In Progress</div>
                            </div>
                            <Timer className="w-12 h-12 text-blue-400 opacity-50" />
                        </div>
                    </div>

                    <div
                        onClick={() => setFilterStatus('completed')}
                        className={`bg-gray-800 p-6 rounded-lg cursor-pointer transition-all ${filterStatus === 'completed' ? 'ring-2 ring-green-500' : 'hover:bg-gray-750'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl font-bold text-green-400 mb-2">
                                    {reportData.completed}
                                </div>
                                <div className="text-sm text-gray-400">Completed</div>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-400 opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex gap-6">
                    {/* Participants Table */}
                    <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-gray-700 bg-gray-750">
                                    <tr>
                                        {visibleColumns.sno && <th className="px-4 py-3 text-left text-gray-400 font-medium">S.No</th>}
                                        {visibleColumns.courseName && <th className="px-4 py-3 text-left text-gray-400 font-medium">Course Name</th>}
                                        {visibleColumns.participantName && <th className="px-4 py-3 text-left text-gray-400 font-medium">Participant name</th>}
                                        {visibleColumns.enrolledDate && <th className="px-4 py-3 text-left text-gray-400 font-medium">Enrolled Date</th>}
                                        {visibleColumns.startDate && <th className="px-4 py-3 text-left text-gray-400 font-medium">Start date</th>}
                                        {visibleColumns.timeSpent && <th className="px-4 py-3 text-left text-gray-400 font-medium">Time spent</th>}
                                        {visibleColumns.completionPercentage && <th className="px-4 py-3 text-left text-gray-400 font-medium">Completion %</th>}
                                        {visibleColumns.completedDate && <th className="px-4 py-3 text-left text-gray-400 font-medium">Completed date</th>}
                                        {visibleColumns.status && <th className="px-4 py-3 text-left text-gray-400 font-medium">Status</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredParticipants.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                                No participants found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredParticipants.map((participant, index) => (
                                            <tr key={participant._id} className="border-b border-gray-700 hover:bg-gray-750">
                                                {visibleColumns.sno && <td className="px-4 py-3 text-gray-300">{index + 1}</td>}
                                                {visibleColumns.courseName && <td className="px-4 py-3 text-blue-400">{participant.courseName}</td>}
                                                {visibleColumns.participantName && <td className="px-4 py-3 text-gray-300">{participant.userName}</td>}
                                                {visibleColumns.enrolledDate && <td className="px-4 py-3 text-gray-400">{formatDate(participant.enrolledDate)}</td>}
                                                {visibleColumns.startDate && <td className="px-4 py-3 text-gray-400">{formatDate(participant.startDate)}</td>}
                                                {visibleColumns.timeSpent && <td className="px-4 py-3 text-red-400">{participant.timeSpent}</td>}
                                                {visibleColumns.completionPercentage && <td className="px-4 py-3 text-cyan-400">{participant.completionPercentage}%</td>}
                                                {visibleColumns.completedDate && <td className="px-4 py-3 text-green-400">{formatDate(participant.completedDate)}</td>}
                                                {visibleColumns.status && (
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(participant.status)}`}>
                                                            {participant.status}
                                                        </span>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Column Customizer Sidebar */}
                    <div className="w-64 bg-gray-800 rounded-lg p-4">
                        <h3 className="text-sm font-semibold mb-2 text-green-400">Customizable table</h3>
                        <p className="text-xs text-gray-400 mb-4">Pick which columns to show/hide</p>

                        <div className="space-y-3">
                            {Object.keys(visibleColumns).map((column) => (
                                <label key={column} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-750 p-2 rounded">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns[column]}
                                        onChange={() => toggleColumn(column)}
                                        className="w-4 h-4 rounded border-gray-600 text-green-500 focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-300">{formatColumnName(column)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportingDashboard;
