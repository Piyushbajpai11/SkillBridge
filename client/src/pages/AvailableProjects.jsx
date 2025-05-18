import { useEffect, useState } from 'react';
import api from '../api/axios';

const AvailableProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appliedProjects, setAppliedProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await api.get('/projects/available', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(data);
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleApply = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            await api.post(`/applications/${projectId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setAppliedProjects((prev) => [...prev, projectId]);
            alert('Applied successfully!');
        } catch (err) {
            console.error('Error applying to project:', err);
            alert(err.response?.data?.message || 'Failed to apply');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Available Projects</h2>
            {projects.length === 0 ? (
                <p className="text-gray-600">No open projects right now.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-white shadow rounded p-5">
                            <h3 className="text-lg font-semibold">{project.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {project.technologies.map((tech, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 bg-gray-200 rounded">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-indigo-600 font-bold">${project.budget}</span>
                                <button
                                    onClick={() => handleApply(project._id)}
                                    disabled={appliedProjects.includes(project._id)}
                                    className={`px-4 py-1 rounded ${appliedProjects.includes(project._id)
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    {appliedProjects.includes(project._id) ? 'Applied' : 'Apply'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AvailableProjects;
