import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
    const { user, loadUser } = useAuth();
    const [formData, setFormData] = useState({
        bio: '',
        skills: '',
        github: '',
        linkedin: '',
        portfolio: '',
        company: '',
        companyLogo: '',
        contact: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                bio: user.bio || '',
                skills: user.skills?.join(', ') || '',
                github: user.github || '',
                linkedin: user.linkedin || '',
                portfolio: user.portfolio || '',
                company: user.company || '',
                companyLogo: user.companyLogo || '',
                contact: user.contact || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updated = {
                ...formData,
                skills: formData.skills.split(',').map((s) => s.trim()),
            };
            await api.put('/users/profile', updated);
            await loadUser();
            alert('Profile updated');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Profile</h2>
                <form onSubmit={handleUpdate} className="space-y-5">
                    {user?.role === 'developer' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    rows="3"
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                                    placeholder="Your bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                />
                            </div>
                            <input
                                type="text"
                                name="skills"
                                placeholder="Skills (comma separated)"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                                value={formData.skills}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="github"
                                placeholder="GitHub URL"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                                value={formData.github}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="linkedin"
                                placeholder="LinkedIn URL"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                                value={formData.linkedin}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="portfolio"
                                placeholder="Portfolio URL"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                                value={formData.portfolio}
                                onChange={handleChange}
                            />
                        </>
                    )}

                    {user?.role === 'client' && (
                        <>
                            <input
                                type="text"
                                name="company"
                                placeholder="Company Name"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                                value={formData.company}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="companyLogo"
                                placeholder="Company Logo URL"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                                value={formData.companyLogo}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="contact"
                                placeholder="Contact Info"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                                value={formData.contact}
                                onChange={handleChange}
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
