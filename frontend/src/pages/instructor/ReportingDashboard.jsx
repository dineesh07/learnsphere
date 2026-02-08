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
        <div className="min-h-screen bg-gray-50 text-gray-900 p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reporting Dashboard</h1>
                        <p className="text-gray-500">Track participant progress across all your courses</p>
                    </div>
                </div>

                {/* Tabs */}
                {/* <div className="flex space-x-4 mb-6 border-b border-gray-200">
                    <button className="px-4 py-2 text-indigo-600 border-b-2 border-indigo-600 font-medium bg-indigo-50 rounded-t-lg">
                        Overview
                    </button>
                    <button className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-lg transition-colors">
                        Users
                    </button>
                </div> */}

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div
                        onClick={() => setFilterStatus('all')}
                        className={`bg-white p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${filterStatus === 'all'
                                ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                                : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Participants</div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {reportData.totalParticipants}
                                </div>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <Users className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => setFilterStatus('yet-to-start')}
                        className={`bg-white p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${filterStatus === 'yet-to-start'
                                ? 'border-red-500 ring-1 ring-red-500 shadow-md'
                                : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Yet to Start</div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {reportData.yetToStart}
                                </div>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg">
                                <Clock className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => setFilterStatus('in-progress')}
                        className={`bg-white p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${filterStatus === 'in-progress'
                                ? 'border-blue-500 ring-1 ring-blue-500 shadow-md'
                                : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">In Progress</div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {reportData.inProgress}
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Timer className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => setFilterStatus('completed')}
                        className={`bg-white p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${filterStatus === 'completed'
                                ? 'border-emerald-500 ring-1 ring-emerald-500 shadow-md'
                                : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Completed</div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {reportData.completed}
                                </div>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex gap-6">
                    {/* Participants Table */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">Detailed Report</h2>
                            {/* <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Download CSV</button> */}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase tracking-wider text-xs">
                                    <tr>
                                        {visibleColumns.sno && <th className="px-6 py-3 font-medium">S.No</th>}
                                        {visibleColumns.courseName && <th className="px-6 py-3 font-medium">Course Name</th>}
                                        {visibleColumns.participantName && <th className="px-6 py-3 font-medium">Participant Name</th>}
                                        {visibleColumns.enrolledDate && <th className="px-6 py-3 font-medium">Enrolled Date</th>}
                                        {visibleColumns.startDate && <th className="px-6 py-3 font-medium">Start Date</th>}
                                        {visibleColumns.timeSpent && <th className="px-6 py-3 font-medium">Time Spent</th>}
                                        {visibleColumns.completionPercentage && <th className="px-6 py-3 font-medium">Completion</th>}
                                        {visibleColumns.completedDate && <th className="px-6 py-3 font-medium">Completed Date</th>}
                                        {visibleColumns.status && <th className="px-6 py-3 font-medium">Status</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredParticipants.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-10 text-center text-gray-500">
                                                No participants found matching current filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredParticipants.map((participant, index) => (
                                            <tr key={participant._id} className="hover:bg-gray-50 transition-colors">
                                                {visibleColumns.sno && <td className="px-6 py-4 text-gray-500 font-medium">{index + 1}</td>}
                                                {visibleColumns.courseName && (
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900">{participant.courseName}</div>
                                                    </td>
                                                )}
                                                {visibleColumns.participantName && (
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900">{participant.userName}</div>
                                                        <div className="text-xs text-gray-500">{participant.userEmail}</div>
                                                    </td>
                                                )}
                                                {visibleColumns.enrolledDate && <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(participant.enrolledDate)}</td>}
                                                {visibleColumns.startDate && <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(participant.startDate)}</td>}
                                                {visibleColumns.timeSpent && <td className="px-6 py-4 text-gray-600 font-medium">{participant.timeSpent}</td>}
                                                {visibleColumns.completionPercentage && (
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                                <div
                                                                    className="bg-indigo-500 h-1.5 rounded-full"
                                                                    style={{ width: `${participant.completionPercentage}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs font-medium text-gray-600">{participant.completionPercentage}%</span>
                                                        </div>
                                                    </td>
                                                )}
                                                {visibleColumns.completedDate && <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(participant.completedDate)}</td>}
                                                {visibleColumns.status && (
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${participant.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                                participant.status === 'In progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                    'bg-red-50 text-red-700 border-red-100'
                                                            }`}>
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
                    <div className="w-72 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">Table Columns</h3>
                            <p className="text-xs text-gray-500 mb-5">Customize the data you want to see</p>

                            <div className="space-y-3">
                                {Object.keys(visibleColumns).map((column) => (
                                    <label key={column} className="flex items-center space-x-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns[column]}
                                                onChange={() => toggleColumn(column)}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all"
                                            />
                                        </div>
                                        <span className={`text-sm group-hover:text-gray-900 transition-colors ${visibleColumns[column] ? 'text-gray-700 font-medium' : 'text-gray-500'
                                            }`}>
                                            {formatColumnName(column)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportingDashboard;
