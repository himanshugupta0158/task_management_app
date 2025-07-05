import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markNotificationAsRead } from "../redux/slices/notificationSlice";

function NotificationPage() {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notifications.notifications) || [];
    const status = useSelector((state) => state.notifications.status);
    const error = useSelector((state) => state.notifications.error);

    console.log("Notifications:", notifications, typeof notifications);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchNotifications());
    };

    const handleMarkAsRead = (notificationId) => {
        dispatch(markNotificationAsRead(notificationId));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Notifications</h1>
                <button
                    onClick={handleRefresh}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    title="Refresh"
                >
                    <i className="fas fa-sync-alt text-blue-600 text-lg"></i>
                </button>
            </div>
            {status === "loading" && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            <ul className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <li
                            key={notification.id}
                            className={`border p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer ${notification.is_read ? "opacity-70" : "font-semibold"
                                }`}
                            onClick={() => handleMarkAsRead(notification.id)}
                        >
                            {notification.message} -{" "}
                            <span className="text-sm text-gray-500">
                                {new Date(notification.created_at).toLocaleString()}
                            </span>
                        </li>
                    ))
                ) : (
                    <li className="text-center text-gray-500">No notifications available</li>
                )}
            </ul>
        </div>
    );
}

export default NotificationPage;
