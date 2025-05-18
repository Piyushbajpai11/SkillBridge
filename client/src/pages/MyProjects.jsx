import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await api.get('/projects/my-projects');
                setProjects(data);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }


    const handleDelete = async (id) => {
        const confirm = window.confirm('Are you sure you want to delete this project?');
        if (!confirm) return;

        try {
            const token = localStorage.getItem('token');
            await api.delete(`/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            console.error('Failed to delete project:', err);
            alert('Error deleting project');
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-project/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">My Projects</h2>
                    <Link
                        to="/create-project"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create New Project
                    </Link>

                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <div
                                key={project._id}
                                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="p-6">
                                    <Link
                                        to={`/projects/${project._id}`}
                                        className="text-lg font-medium text-indigo-700 hover:underline"
                                    >
                                        {project.title}
                                    </Link>

                                    <p className="mt-2 text-sm text-gray-500 line-clamp-3">{project.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {project.status}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">
                                            ${project.budget}
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies?.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(project._id)}
                                            className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProjects;
