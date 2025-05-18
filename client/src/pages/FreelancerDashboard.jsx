import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const FreelancerDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('No token found, redirecting to login');
                    navigate('/login');
                    return;
                }

                console.log('Fetching applications with token:', token.substring(0, 20) + '...');
                const response = await api.get('/api/applications/my', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                console.log('API Response:', response.data);
                setApplications(response.data);
                setError(null);
            } catch (error) {
                console.error('Detailed error:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                setError(
                    error.response?.data?.message ||
                    error.message ||
                    'Failed to fetch applications. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">My Applications</h2>
            {applications.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">No applications found.</p>
                    <button
                        onClick={() => navigate('/available-projects')}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Browse Available Projects
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {applications.map(({ _id, project }) => (
                        <div key={_id} className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-semibold">{project.title}</h3>
                            <p className="text-gray-600 mt-1 line-clamp-3">{project.description}</p>
                            <div className="mt-3 flex justify-between items-center">
                                <span className="text-sm text-gray-500">${project.budget}</span>
                                <span className={`text-xs px-2 py-1 rounded ${project.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    project.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FreelancerDashboard;
