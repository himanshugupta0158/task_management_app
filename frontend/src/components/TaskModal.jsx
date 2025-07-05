import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createTask, updateTask } from "../redux/slices/taskSlice";
import { fetchUsers } from "../redux/slices/authSlice";
import { format } from "date-fns";

function TaskModal({ isOpen, onClose, task }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const usersRaw = useSelector((state) => state.auth.users);
    const users = Array.isArray(usersRaw) ? usersRaw.filter(u => u && u.id && u.username) : [];
    const [form, setForm] = useState({
        title: task?.title || "",
        description: task?.description || "",
        priority: task?.priority || "",
        assigned_to: task?.assigned_to || user?.id || "",
        due_date: task?.due_date ? new Date(task.due_date) : null,
        status: task?.status || "pending",
    });
    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title,
                description: task.description,
                priority: task.priority,
                assigned_to: task.assigned_to,
                due_date: task.due_date ? new Date(task.due_date) : null,
                status: task.status || "pending",
            });
        } else if (user) {
            setForm({
                title: "",
                description: "",
                priority: "",
                assigned_to: user.id,
                due_date: null,
                status: "pending",
            });
        }
        setErrors({});
    }, [task, user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen && user) {
            dispatch(fetchUsers());
        }
    }, [dispatch, isOpen, user]);

    useEffect(() => {
        console.log("Users state in TaskModal:", usersRaw);
    }, [usersRaw]);

    const validateForm = () => {
        const newErrors = {};
        const currentDate = new Date("2025-07-05T17:50:00"); // 05:50 PM IST

        if (!form.title.trim()) newErrors.title = "Title is required";
        else if (form.title.length > 100) newErrors.title = "Title must be less than 100 characters";

        if (!form.description.trim()) newErrors.description = "Description is required";
        else if (form.description.length > 500) newErrors.description = "Description must be less than 500 characters";

        if (!form.due_date) newErrors.due_date = "Due date is required";
        else if (form.due_date <= currentDate) newErrors.due_date = "Due date must be in the future";

        if (!form.priority) newErrors.priority = "Priority is required";
        else if (!["high", "medium", "low"].includes(form.priority)) newErrors.priority = "Invalid priority value";

        if (!form.status) newErrors.status = "Status is required";
        else if (!["pending", "in_progress", "completed"].includes(form.status)) newErrors.status = "Invalid status value";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "assigned_to" && user?.role === "regular") return; // Prevent changes for regular users
        setForm({ ...form, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: "" });
    };

    const handleDateChange = (date) => {
        setForm({ ...form, due_date: date });
        if (errors.due_date) setErrors({ ...errors, due_date: "" });
    };

    const handleSubmit = () => {
        if (!user || !validateForm()) return;
        const taskData = {
            ...form,
            due_date: form.due_date ? format(form.due_date, "yyyy-MM-dd") : "",
        };
        if (task) {
            dispatch(updateTask({ taskId: task.id, updates: taskData }));
        } else {
            dispatch(createTask({ ...taskData, created_by: user.id }));
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">{task ? "Edit Task" : "Create Task"}</h2>
                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Task Title"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>
                    <div>
                        <DatePicker
                            selected={form.due_date}
                            onChange={handleDateChange}
                            placeholderText="Select Due Date"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            dateFormat="yyyy-MM-dd"
                            minDate={new Date("2025-07-05T17:51:00")}
                        />
                        {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
                    </div>
                    <div>
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
                    </div>
                    <div>
                        <select
                            name="assigned_to"
                            value={form.assigned_to}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={user?.role === "regular"}
                        >
                            <option value="">Assign To</option>
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
                        {errors.assigned_to && <p className="text-red-500 text-sm mt-1">{errors.assigned_to}</p>}
                    </div>
                    <div>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={onClose}
                            className="bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
                            disabled={Object.keys(errors).length > 0}
                        >
                            {task ? "Update Task" : "Create Task"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskModal;