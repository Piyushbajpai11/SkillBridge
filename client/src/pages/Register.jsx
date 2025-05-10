import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('developer'); // or 'client'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loadUser } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', {
                name,
                email,
                password,
                role,
            });
            localStorage.setItem('token', data.token);
            await loadUser();
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800">Register to SkillBridge</h2>
                <form onSubmit={handleRegister} className='space-y-4'>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        required
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="developer">Developer</option>
                        <option value="client">Client</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
