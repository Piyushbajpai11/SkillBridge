import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome, {user?.name}</h2>
                <div className="space-y-3 text-gray-700 text-lg">
                    <p>
                        <span className="font-medium">Role:</span> {user?.role}
                    </p>
                    <p>
                        <span className="font-medium">Email:</span> {user?.email}
                    </p>
                    <p>
                        This is your dashboard where you'll see your job postings, applications,
                        or saved opportunities — depending on your role.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;