import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/slices/taskSlice';
import { fetchUsers } from '../redux/slices/authSlice';
import { fetchNotifications } from '../redux/slices/notificationSlice';
import { fetchLogs } from '../redux/slices/logSlice';
import { Link } from 'react-router-dom';

function HomePage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const tasks = useSelector((state) => state.tasks.tasks);
    const users = useSelector((state) => state.auth.users);
    const notifications = useSelector((state) => state.notifications.notifications);
    const { logs, status, error } = useSelector((state) => state.logs);

    useEffect(() => {
        if (user) {
            dispatch(fetchTasks());
            dispatch(fetchUsers());
            dispatch(fetchNotifications());
            dispatch(fetchLogs());
        }
    }, [dispatch, user]);

    const createdTasks = tasks.filter((task) => task.created_by === user?.id);
    const assignedTasks = tasks.filter((task) => task.assigned_to === user?.id);
    const completedTasks = tasks.filter((task) => task.status === 'completed' && (task.created_by === user?.id || task.assigned_to === user?.id));
    const pendingTasks = tasks.filter((task) => task.status === 'pending' && (task.created_by === user?.id || task.assigned_to === user?.id));

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Welcome, {user?.username || 'User'}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Created Tasks</h2>
                    <p className="text-2xl">{createdTasks.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Assigned Tasks</h2>
                    <p className="text-2xl">{assignedTasks.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Completed Tasks</h2>
                    <p className="text-2xl">{completedTasks.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Pending Tasks</h2>
                    <p className="text-2xl">{pendingTasks.length}</p>
                </div>
            </div>
            {(user?.role === 'super_admin' || user?.role === 'admin') && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">User Management</h2>
                    <ul className="space-y-2">
                        {users
                            .filter((u) => user.role === 'super_admin' || user.connected_users.includes(u.id))
                            .map((u) => (
                                <li key={u.id} className="border p-2 rounded">
                                    {u.username} ({u.role})
                                </li>
                            ))}
                    </ul>
                </div>
            )}
            <div className="mb-6 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                {status === 'loading' && <p className="text-center">Loading logs...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                <ul className="space-y-2">
                    {logs.map((log) => (
                        <li key={log.id} className="border p-2 rounded">
                            {log.action} - {new Date(log.created_at).toLocaleString()}
                        </li>
                    ))}
                </ul>
            </div>
            <Link to="/tasks" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                Go to Tasks
            </Link>
        </div>
    );
}

export default HomePage;