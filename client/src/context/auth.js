import api from '../api/axios';

// Load user from token
export const loadUserFromToken = async () => {
    try {
        const { data } = await api.get('/users/profile');
        return data;
    } catch (err) {
        console.error('Error loading user:', err);
        return null;
    }
};

// Logout user
export const logoutUser = () => {
    localStorage.removeItem('token');
};
