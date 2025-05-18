import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const navigate = useNavigate();

    const loadUser = async () => {
        try {
            const { data } = await api.get('/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(data);
        } catch (err) {
            setUser(null);
            console.log(err);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken('');
        navigate('/');
    };

    useEffect(() => {
        if (token) {
            loadUser();
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, setToken, setUser, loadUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
