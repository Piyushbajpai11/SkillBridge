import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();

    // If user is null (not loaded yet), show loading state
    if (user === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Loading...</p>
            </div>
        );
    }

    // If user is loaded and exists, show the protected content
    // If user is loaded but doesn't exist, redirect to login
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
