import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import MyProjects from './pages/MyProjects';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ProjectDetails from './pages/ProjectDetails';
import BrowseProjects from './pages/BrowseProjects';
import MyApplications from './pages/MyApplications';

const Layout = () => {
    // const { user } = useAuth();
    const location = useLocation();
    const hideNavbar = location.pathname === '/login' || location.pathname === '/register';
    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/my-projects" element={<PrivateRoute><MyProjects /></PrivateRoute>} />
                <Route path="/create-project" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
                <Route path="/edit-project/:id" element={<PrivateRoute><EditProject /></PrivateRoute>} />
                <Route path="/freelancer-dashboard" element={<PrivateRoute><FreelancerDashboard /></PrivateRoute>} />
                <Route path="/projects/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
                <Route path="/browse-projects" element={<BrowseProjects />} />
                <Route path="/my-applications" element={<MyApplications />} />
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