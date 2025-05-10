import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();  // Initialize the useNavigate hook

    const loadUser = async () => {
        try {
            const { data } = await api.get('/users/profile');
            setUser(data);
        } catch (err) {
            setUser(null);
            console.log(err);
        }
    };

    const logout = () => {
        // Clear the token and user data from localStorage and the state
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');  // Redirect to the home page
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUser();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loadUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
