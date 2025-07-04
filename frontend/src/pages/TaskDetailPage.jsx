import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function TaskDetailPage() {
    const { id } = useParams();
    const task = useSelector((state) => state.tasks.tasks.find((t) => t.id === parseInt(id)));

    if (!task) return <div className="p-6">Task not found</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl mb-4">{task.title}</h1>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Due Date:</strong> {task.due_date}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Assigned To:</strong> {task.assigned_to}</p>
        </div>
    );
}

export default TaskDetailPage;