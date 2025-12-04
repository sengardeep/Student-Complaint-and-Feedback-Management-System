import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyComplaints, createComplaint, deleteComplaint } from '../api';

export default function StudentDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = ['Academics', 'Hostel', 'Canteen', 'Infrastructure', 'Transport', 'Others'];

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await getMyComplaints();
            setComplaints(response.data);
        } catch (err) {
            setError('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await createComplaint(formData);
            setSuccess('Complaint submitted successfully!');
            setFormData({ category: '', title: '', description: '' });
            setShowForm(false);
            fetchComplaints();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit complaint');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this complaint?')) return;

        try {
            await deleteComplaint(id);
            setSuccess('Complaint deleted successfully');
            fetchComplaints();
        } catch (err) {
            setError('Failed to delete complaint');
        }
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

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <div className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Student Portal
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="text-gray-500 text-sm mb-2">Total Complaints</div>
                        <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl shadow-lg p-6 border border-yellow-300">
                        <div className="text-yellow-800 text-sm mb-2">Pending</div>
                        <div className="text-3xl font-bold text-yellow-900">{stats.pending}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-lg p-6 border border-blue-300">
                        <div className="text-blue-800 text-sm mb-2">In Progress</div>
                        <div className="text-3xl font-bold text-blue-900">{stats.inProgress}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-lg p-6 border border-green-300">
                        <div className="text-green-800 text-sm mb-2">Resolved</div>
                        <div className="text-3xl font-bold text-green-900">{stats.resolved}</div>
                    </div>
                </div>

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

                {/* Submit Complaint Button */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg transform hover:scale-105"
                    >
                        {showForm ? 'Cancel' : '+ Submit New Complaint'}
                    </button>
                </div>

                {/* Complaint Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Submit a Complaint</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Brief title for your complaint"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe your complaint in detail"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg"
                            >
                                Submit Complaint
                            </button>
                        </form>
                    </div>
                )}

                {/* Complaints List */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
                        <h2 className="text-xl font-bold text-white">My Complaints</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : complaints.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No complaints submitted yet. Submit your first complaint!
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {complaints.map((complaint) => (
                                <div key={complaint._id} className="p-6 hover:bg-gray-50 transition duration-150">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                                                    {complaint.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                <span className="font-medium">Category:</span> {complaint.category}
                                            </p>
                                            <p className="text-gray-700">{complaint.description}</p>
                                            {complaint.adminRemarks && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    <p className="text-sm font-medium text-blue-800 mb-1">Admin Remarks:</p>
                                                    <p className="text-sm text-blue-700">{complaint.adminRemarks}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                                        {complaint.status === 'Pending' && (
                                            <button
                                                onClick={() => handleDelete(complaint._id)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
