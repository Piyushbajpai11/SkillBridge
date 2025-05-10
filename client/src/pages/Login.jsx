import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loadUser } = useAuth(); // Load user after successful login
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Call login API
            const { data } = await api.post('/auth/login', { email, password });

            // Save token to localStorage
            localStorage.setItem('token', data.token);

            // Load the user from the API using the saved token
            await loadUser();

            // Redirect to the dashboard after successful login
            navigate('/dashboard');
        } catch (err) {
            // Handle error if login fails
            console.error("Login failed:", err);
            alert(err.response?.data?.message || "An error occurred during login.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login to SkillBridge</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type='submit'
                        className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                    >Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
