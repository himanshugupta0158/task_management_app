import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function TaskDetailPage() {
    const { id } = useParams();
    const tasks = useSelector((state) => state.tasks.tasks) || [];
    const task = tasks.find((t) => t.id === parseInt(id));

    if (!task) return <div className="p-6 text-center text-gray-500">Task not found</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl mb-4 font-bold">{task.title}</h1>
            <p>
                <strong>Description:</strong> {task.description || "N/A"}
            </p>
            <p>
                <strong>Due Date:</strong> {task.due_date || "N/A"}
            </p>
            <p>
                <strong>Priority:</strong> {task.priority || "N/A"}
            </p>
            <p>
                <strong>Status:</strong> {task.status || "N/A"}
            </p>
            <p>
                <strong>Assigned To:</strong> {task.assigned_to || "N/A"}
            </p>
        </div>
    );
}

export default TaskDetailPage;