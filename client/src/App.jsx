import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';


const Layout = () => {
    // const { user } = useAuth();
    const location = useLocation();
    const hideNavbar = location.pathname === '/login' || location.pathname === '/register';
    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            </Routes>
        </>
    )
}


function App() {
    return (
        <Router>
            <AuthProvider>
                <Layout />
            </AuthProvider>
        </Router>

    )
}

export default App;