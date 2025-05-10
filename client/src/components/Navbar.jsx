import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth(); // Access user and logout function from context
    const navigate = useNavigate(); // Navigate function to redirect after logout
    const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu toggle

    // Logout handler function
    const handleLogout = () => {
        logout(); // Clear session data from AuthContext and localStorage
        navigate('/'); // Redirect to home page after logging out
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-indigo-600">
                    SkillBridge
                </Link>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-gray-700 text-2xl focus:outline-none"
                >
                    ☰
                </button>

                {/* Menu links */}
                <div
                    className={`${menuOpen ? 'block' : 'hidden'} md:flex md:items-center md:space-x-6 w-full md:w-auto mt-4 md:mt-0`}
                >
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="block mt-2 md:mt-0 text-gray-700 hover:text-indigo-600"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/profile"
                                className="block mt-2 md:mt-0 text-gray-700 hover:text-indigo-600"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="mt-2 md:mt-0 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="block mt-2 md:mt-0 text-gray-700 hover:text-indigo-600"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="block mt-2 md:mt-0 text-gray-700 hover:text-indigo-600"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
