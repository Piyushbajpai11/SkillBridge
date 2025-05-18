import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await api.get(`/projects/${id}`);
                setProject(data);
            } catch (err) {
                console.error('Failed to load project', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleApply = async () => {
        try {
            const token = localStorage.getItem('token');
            await api.post(`/applications/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplied(true);
            alert('Application submitted successfully!');
        } catch (err) {
            console.error('Failed to apply:', err);
            alert(err?.response?.data?.message || 'Error applying to project');
        }
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (!project) return <div className="text-center p-10 text-red-500">Project not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
            <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
            <p className="mb-2 text-gray-700">{project.description}</p>
            <div className="mb-4">
                <strong>Budget:</strong> ${project.budget}
            </div>
            <div className="mb-4">
                <strong>Technologies:</strong> {project.technologies.join(', ')}
            </div>
            <button
                onClick={handleApply}
                disabled={applied}
                className={`mt-4 px-4 py-2 rounded ${applied ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white`}
            >
                {applied ? 'Applied' : 'Apply to Project'}
            </button>
        </div>
    );
};

export default ProjectDetails;
