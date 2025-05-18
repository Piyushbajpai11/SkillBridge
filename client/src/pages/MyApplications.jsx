import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyApplications = () => {
    const { token } = useAuth();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/applications/my-applications', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Safeguard: Make sure the response is an array
                if (Array.isArray(res.data)) {
                    setApplications(res.data);
                } else {
                    console.warn('Expected an array but got:', res.data);
                    setApplications([]);
                }
            } catch (err) {
                console.error('Error fetching applications:', err);
                setApplications([]);
            }
        };

        fetchApplications();
    }, [token]);

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">My Applications</h2>
            {Array.isArray(applications) && applications.length === 0 ? (
                <p>No applications submitted yet.</p>
            ) : (
                applications.map(app => (
                    <div
                        key={app._id}
                        className="border p-4 rounded shadow mb-4"
                    >
                        <h3 className="text-lg font-semibold">
                            {app.project ? app.project.title : 'Project not found'}
                        </h3>
                        <p className="text-gray-600">
                            {app.project ? app.project.description : 'No description available'}
                        </p>
                        <p><strong>Status:</strong> {app.status}</p>
                        <p><strong>Cover Letter:</strong> {app.coverLetter}</p>
                        <p><strong>Applied on:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                ))
            )}

        </div>
    );
};

export default MyApplications;
