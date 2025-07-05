import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, fetchTaskStats } from "../redux/slices/taskSlice";
import { fetchUsers } from "../redux/slices/authSlice";
import { fetchNotifications } from "../redux/slices/notificationSlice";
import { Link } from "react-router-dom";

function HomePage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const tasksRaw = useSelector((state) => state.tasks.tasks);
    const tasks = Array.isArray(tasksRaw) ? tasksRaw : [];
    const users = useSelector((state) => state.auth.users) || [];
    const stats = useSelector((state) => state.tasks.stats);
    const notifications = useSelector((state) => state.notifications.notifications) || [];

    useEffect(() => {
        if (user) {
            dispatch(fetchTasks());
            dispatch(fetchUsers());
            dispatch(fetchNotifications());
            dispatch(fetchTaskStats());
        }
    }, [dispatch, user]);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Welcome, {user?.username || "User"}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Created Tasks</h2>
                    <p className="text-2xl">{stats.created}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Assigned Tasks</h2>
                    <p className="text-2xl">{stats.assigned}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Completed Tasks</h2>
                    <p className="text-2xl">{stats.completed}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Pending Tasks</h2>
                    <p className="text-2xl">{stats.pending}</p>
                </div>
            </div>

            {(user?.role === "super_admin" || user?.role === "admin") && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">User Management</h2>
                    <ul className="space-y-2">
                        {users
                            .filter((u) => user.role === "super_admin" || (user.connected_users && user.connected_users.includes(u.id)))
                            .map((u) => (
                                <li key={u.id} className="border p-2 rounded">
                                    {u.username} ({u.role})
                                </li>
                            ))}
                    </ul>
                </div>
            )}

            <Link to="/tasks" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                Go to Tasks
            </Link>
        </div>
    );
}

export default HomePage;