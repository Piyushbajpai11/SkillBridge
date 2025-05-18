import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BrowseProjects = () => {
    const { token } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appliedId, setAppliedId] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTech, setSelectedTech] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects/browse-projects');
                if (Array.isArray(res.data)) {
                    setProjects(res.data);
                } else {
                    console.warn("Expected array but got:", res.data);
                    setProjects([]);
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleApply = async (projectId) => {
        try {
            await api.post(`/applications/${projectId}`, { coverLetter });
            alert('Applied successfully!');
            setAppliedId(projectId);
            setSelectedProject(null);
            setCoverLetter('');
        } catch (err) {
            console.error('Error applying:', err.response?.data || err.message);
            alert(err.response?.data?.message || 'Application failed');
        }
    };

    // Get unique technologies from all projects
    const allTechnologies = [...new Set(projects.flatMap(project => project.technologies))];

    // Filter and sort projects
    const filteredProjects = projects
        .filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTech = !selectedTech || project.technologies.includes(selectedTech);
            return matchesSearch && matchesTech;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'budget-high':
                    return b.budget - a.budget;
                case 'budget-low':
                    return a.budget - b.budget;
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Browse Projects
                    </h2>
                    <p className="mt-4 text-xl text-gray-500">
                        Find your next opportunity from our curated list of projects
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <select
                            value={selectedTech}
                            onChange={(e) => setSelectedTech(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Technologies</option>
                            {allTechnologies.map(tech => (
                                <option key={tech} value={tech}>{tech}</option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="budget-high">Highest Budget</option>
                            <option value="budget-low">Lowest Budget</option>
                        </select>
                    </div>
                </div>

                {filteredProjects.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
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
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProjects.map(project => (
                            <div
                                key={project._id}
                                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{project.title}</h3>
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${project.status === 'Open'
                                                ? 'bg-green-100 text-green-800'
                                                : project.status === 'In Progress'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {project.status}
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800">
                                                ${project.budget}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <span className="flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(project.deadline).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {appliedId === project._id ? (
                                        <div className="text-center py-2 bg-green-50 text-green-700 rounded-lg">
                                            ✓ Applied Successfully
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02]"
                                        >
                                            Apply Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Application Modal */}
                {selectedProject && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                        <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 transform transition-all duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Apply for {selectedProject.title}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setSelectedProject(null);
                                            setCoverLetter('');
                                        }}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Write a compelling cover letter explaining why you're the best fit for this project..."
                                    rows={6}
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                />
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setSelectedProject(null);
                                            setCoverLetter('');
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleApply(selectedProject._id)}
                                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                                    >
                                        Submit Application
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseProjects;
