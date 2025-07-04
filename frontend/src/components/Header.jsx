import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import ProfileModal from './ProfileModal';

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const notifications = useSelector((state) => state.notifications.notifications || []);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        setShowProfileModal(false);
    };

    // Generate initials from username or email
    const getInitials = () => {
        if (!user) return '';
        if (user.username) return user.username.charAt(0).toUpperCase();
        if (user.email) {
            const [firstName] = user.email.split('.')[0].split('@');
            return firstName.charAt(0).toUpperCase();
        }
        return '';
    };

    // Calculate unread notification count
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <header className="bg-blue-600 text-white p-4 shadow-md z-20">
            <div className="container mx-auto flex justify-start items-center space-x-4">
                <h1 className="text-2xl font-bold">Task Management</h1>
                <nav className="flex-1 flex justify-end items-center space-x-4">
                    {user ? (
                        <>
                            <div className="relative">
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-800"
                                >
                                    {getInitials()}
                                </button>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => navigate('/notifications')}
                                    className="bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800 flex items-center relative"
                                >
                                    <i className="fas fa-bell"></i>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                            <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
                            {showProfileModal && (
                                <div
                                    className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
                                    onClick={() => setShowProfileModal(false)}
                                ></div>
                            )}
                        </>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/register" className="hover:underline">Register</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;