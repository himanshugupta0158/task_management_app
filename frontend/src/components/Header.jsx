import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchNotifications } from "../redux/slices/notificationSlice";
import { toast } from "react-toastify";
import { logout } from "../redux/slices/authSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const notifications = useSelector((state) => state.notifications.notifications) || [];
  const unreadCount = Array.isArray(notifications) ? notifications.filter((n) => !n.is_read).length : 0;

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user && localStorage.getItem("access")) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/");
    setShowDropdown(false);
  };

  const getInitials = () => {
    if (!user) return "";
    return user.username ? user.username.charAt(0).toUpperCase() : "";
  };

  const handleNotificationClick = () => {
    console.log("Navigating to /notifications");
    navigate("/notifications");
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md z-20">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800 flex items-center"
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-800"
                >
                  {getInitials()}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg w-40">
                    <div className="p-2 border-b">
                      {user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase()}
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left p-2 hover:bg-gray-200"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left p-2 text-red-600 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

            </>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;