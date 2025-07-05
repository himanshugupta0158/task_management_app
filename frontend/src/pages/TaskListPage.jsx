import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask } from "../redux/slices/taskSlice";
import { fetchUsers } from "../redux/slices/authSlice";
import TaskModal from "../components/TaskModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TaskListPage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const usersRaw = useSelector((state) => state.auth.users);
    const users = Array.isArray(usersRaw) ? usersRaw.filter(u => u && u.id && u.username) : [];
    const tasks = useSelector((state) => state.tasks.tasks) || [];
    const status = useSelector((state) => state.tasks.status);
    const error = useSelector((state) => state.tasks.error);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filters, setFilters] = useState({
        due_date: "",
        priority: "",
        assigned_to: "",
    });
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    useEffect(() => {
        if (user) {
            dispatch(fetchUsers());
            dispatch(fetchTasks(filters));
        }
    }, [dispatch, user, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
        setShowFilterDropdown(false);
    };

    const handleDateFilterChange = (date) => {
        setFilters({ ...filters, due_date: date ? date.toISOString().split("T")[0] : "" });
        setShowFilterDropdown(false);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask(taskId));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Tasks</h1>
            {user ? (
                <div className="mb-6">
                    <button
                        onClick={() => {
                            setEditingTask(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                        Create Task
                    </button>
                </div>
            ) : (
                <p className="text-red-500 mb-6">Please log in to create tasks.</p>
            )}
            <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} task={editingTask} />
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Task List</h2>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 flex items-center"
                        >
                            <i className="fas fa-filter"></i>
                        </button>
                        {showFilterDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg animate-fade-in z-10">
                                <div className="p-2">
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                        <div className="relative">
                                            <DatePicker
                                                selected={filters.due_date ? new Date(filters.due_date) : null}
                                                onChange={handleDateFilterChange}
                                                placeholderText="Select Date"
                                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                dateFormat="yyyy-MM-dd"
                                                minDate={new Date("2025-07-05T17:50:00")} // Next minute from 05:50 PM IST
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                                        <select
                                            name="priority"
                                            value={filters.priority}
                                            onChange={handleFilterChange}
                                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">All</option>
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                                        <select
                                            name="assigned_to"
                                            value={filters.assigned_to}
                                            onChange={handleFilterChange}
                                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">All</option>
                                            {users.length > 0 ? (
                                                users.map((u) => (
                                                    <option key={u.id} value={u.id}>
                                                        {u.username || `User ${u.id}`}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No users available</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {status === "loading" && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Due Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Assigned To
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Created By
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
                                        <td className="px-6 py-4">{task.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{task.due_date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{task.priority}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{task.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {users.find((u) => u.id === task.assigned_to)?.username || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {users.find((u) => u.id === task.created_by)?.username || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(user?.role !== "regular" || task.created_by === user.id) && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditTask(task)}
                                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-gray-500">
                                        {status === "loading" ? "Loading tasks..." : "No tasks found"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TaskListPage;