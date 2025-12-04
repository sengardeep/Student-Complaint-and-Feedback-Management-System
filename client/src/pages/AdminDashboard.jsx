import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllComplaints, updateComplaintStatus, getDashboardStats } from '../api';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', category: '' });
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState({ status: '', adminRemarks: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = ['Academics', 'Hostel', 'Canteen', 'Infrastructure', 'Transport', 'Others'];
    const statuses = ['Pending', 'In Progress', 'Resolved'];

    useEffect(() => {
        fetchStats();
        fetchComplaints();
    }, [filters]);

    const fetchStats = async () => {
        try {
            const response = await getDashboardStats();
            setStats(response.data);
        } catch (err) {
            console.error('Failed to load stats');
        }
    };

    const fetchComplaints = async () => {
        try {
            const response = await getAllComplaints(filters);
            setComplaints(response.data);
        } catch (err) {
            setError('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await updateComplaintStatus(selectedComplaint._id, statusUpdate);
            setSuccess('Complaint status updated successfully');
            setSelectedComplaint(null);
            setStatusUpdate({ status: '', adminRemarks: '' });
            fetchComplaints();
            fetchStats();
        } catch (err) {
            setError('Failed to update status');
        }
    };

    const openComplaintModal = (complaint) => {
        setSelectedComplaint(complaint);
        setStatusUpdate({ status: complaint.status, adminRemarks: complaint.adminRemarks || '' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Resolved':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">Welcome, {user?.name}</p>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-xl p-6 text-white">
                            <div className="text-purple-100 text-sm mb-2">Total Complaints</div>
                            <div className="text-4xl font-bold">{stats.total}</div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-xl p-6 text-white">
                            <div className="text-yellow-100 text-sm mb-2">Pending</div>
                            <div className="text-4xl font-bold">{stats.pending}</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-6 text-white">
                            <div className="text-blue-100 text-sm mb-2">In Progress</div>
                            <div className="text-4xl font-bold">{stats.inProgress}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-xl p-6 text-white">
                            <div className="text-green-100 text-sm mb-2">Resolved</div>
                            <div className="text-4xl font-bold">{stats.resolved}</div>
                        </div>
                    </div>
                )}

                {/* Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r">
                        {success}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Statuses</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ status: '', category: '' })}
                                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition duration-200"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Complaints Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600">
                        <h2 className="text-xl font-bold text-white">All Complaints</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : complaints.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No complaints found matching the current filters.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {complaints.map((complaint) => (
                                        <tr key={complaint._id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{complaint.userId?.name}</div>
                                                <div className="text-sm text-gray-500">{complaint.userId?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{complaint.category}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">{complaint.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                                                    {complaint.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => openComplaintModal(complaint)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for updating complaint */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Manage Complaint</h2>
                                <button
                                    onClick={() => setSelectedComplaint(null)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="mb-3">
                                    <span className="text-sm font-medium text-gray-600">Student: </span>
                                    <span className="text-sm text-gray-900">{selectedComplaint.userId?.name}</span>
                                </div>
                                <div className="mb-3">
                                    <span className="text-sm font-medium text-gray-600">Category: </span>
                                    <span className="text-sm text-gray-900">{selectedComplaint.category}</span>
                                </div>
                                <div className="mb-3">
                                    <span className="text-sm font-medium text-gray-600">Title: </span>
                                    <span className="text-sm font-semibold text-gray-900">{selectedComplaint.title}</span>
                                </div>
                                <div className="mb-3">
                                    <span className="text-sm font-medium text-gray-600">Description: </span>
                                    <p className="text-sm text-gray-700 mt-1">{selectedComplaint.description}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Submitted: </span>
                                    <span className="text-sm text-gray-900">
                                        {new Date(selectedComplaint.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleStatusUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={statusUpdate.status}
                                        onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {statuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin Remarks</label>
                                    <textarea
                                        value={statusUpdate.adminRemarks}
                                        onChange={(e) => setStatusUpdate({ ...statusUpdate, adminRemarks: e.target.value })}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add notes or resolution details..."
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg"
                                    >
                                        Update Status
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedComplaint(null)}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
