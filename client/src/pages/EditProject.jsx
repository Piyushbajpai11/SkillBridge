import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

const EditProject = () => {
    const { id } = useParams();
    // const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        title: '',
        description: '',
        budget: '',
        technologies: '',
        deadline: ''
    });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await api.get(`/projects/${id}`);
                setForm({
                    title: data.title,
                    description: data.description,
                    budget: data.budget,
                    technologies: data.technologies.join(', '),
                    deadline: new Date(data.deadline).toISOString().split('T')[0]
                });
            } catch (err) {
                console.error('Failed to fetch project:', err);
                navigate('/my-projects');
            }
        };

        fetchProject();
    }, [id, navigate]);

    const validateForm = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = 'Title is required';
        if (!form.description.trim()) newErrors.description = 'Description is required';
        if (!form.budget) newErrors.budget = 'Budget is required';
        if (form.budget && form.budget < 0) newErrors.budget = 'Budget cannot be negative';
        if (!form.deadline) newErrors.deadline = 'Deadline is required';
        if (form.deadline && new Date(form.deadline) < new Date()) {
            newErrors.deadline = 'Deadline cannot be in the past';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await api.put(`/projects/${id}`, {
                ...form,
                technologies: form.technologies.split(',').map(tech => tech.trim())
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            navigate('/my-projects');
        } catch (err) {
            console.error(err);
            setErrors(prev => ({
                ...prev,
                submit: err.response?.data?.message || 'Error updating project'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-8 sm:p-10">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                Edit Project
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Update your project details below
                            </p>
                        </div>

                        {errors.submit && (
                            <div className="mt-4 p-4 rounded-md bg-red-50 border border-red-200">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{errors.submit}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Project Title
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={form.title}
                                            onChange={handleChange}
                                            required
                                            className={`block w-full rounded-md shadow-sm sm:text-sm transition-colors duration-200 ${errors.title
                                                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                                }`}
                                        />
                                        {errors.title && (
                                            <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            value={form.description}
                                            onChange={handleChange}
                                            required
                                            className={`block w-full rounded-md shadow-sm sm:text-sm transition-colors duration-200 ${errors.description
                                                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                                }`}
                                        />
                                        {errors.description && (
                                            <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                                        Budget (USD)
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            id="budget"
                                            name="budget"
                                            value={form.budget}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            className={`pl-7 block w-full rounded-md shadow-sm sm:text-sm transition-colors duration-200 ${errors.budget
                                                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                                }`}
                                        />
                                        {errors.budget && (
                                            <p className="mt-2 text-sm text-red-600">{errors.budget}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">
                                        Technologies
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="technologies"
                                            name="technologies"
                                            value={form.technologies}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                                        Deadline
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="date"
                                            id="deadline"
                                            name="deadline"
                                            value={form.deadline}
                                            onChange={handleChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className={`block w-full rounded-md shadow-sm sm:text-sm transition-colors duration-200 ${errors.deadline
                                                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                                }`}
                                        />
                                        {errors.deadline && (
                                            <p className="mt-2 text-sm text-red-600">{errors.deadline}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate('/my-projects')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProject; 