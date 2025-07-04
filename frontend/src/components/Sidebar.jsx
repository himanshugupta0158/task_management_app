import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    if (!user) return null;

    return (
        <aside className="w-64 bg-gray-800 text-white h-screen p-4 z-10">
            <nav className="space-y-2">
                <NavLink
                    to="/home"
                    className={({ isActive }) =>
                        `block px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-600' : ''}`
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/tasks"
                    className={({ isActive }) =>
                        `block px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-600' : ''}`
                    }
                >
                    Tasks
                </NavLink>
                <NavLink
                    to="/notifications"
                    className={({ isActive }) =>
                        `block px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-600' : ''}`
                    }
                >
                    Notifications
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                    Logout
                </button>
            </nav>
        </aside>
    );
}

export default Sidebar;