import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../redux/slices/notificationSlice';

function NotificationPage() {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notifications.notifications);
    const status = useSelector((state) => state.notifications.status);
    const error = useSelector((state) => state.notifications.error);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Notifications</h1>
            {status === 'loading' && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            <ul className="space-y-4">
                {Array.isArray(notifications) && notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <li key={notification.id} className="border p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                            {notification.message} - {notification.created_at}
                        </li>
                    ))) : (
                    <li className="text-center text-gray-500">No notifications available</li>
                )
                }
            </ul>
        </div>
    );
}

export default NotificationPage;