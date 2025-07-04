import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../redux/slices/authSlice';

function ProfileModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [form, setForm] = useState({
        email: '',
        username: '',
        new_password: '',
    });
    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);

    useEffect(() => {
        if (user && isOpen) {
            setForm({
                email: user.email || '',
                username: user.username || '',
                new_password: '',
            });
            setErrors({});
        }
    }, [user, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!emailRegex.test(form.email)) newErrors.email = 'Invalid email format';

        if (!form.username.trim()) newErrors.username = 'Username is required';
        else if (!usernameRegex.test(form.username)) newErrors.username = 'Username must be 3-20 characters, alphanumeric with _ or -';

        if (form.new_password && !passwordRegex.test(form.new_password)) newErrors.new_password = 'Password must be at least 6 characters with a letter and a number';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const handleUpdate = () => {
        if (!validateForm()) return;
        const updatedUser = { ...user, ...form };
        if (form.new_password) updatedUser.password = form.new_password;
        dispatch(updateUserProfile(updatedUser));
        onClose(); // Close modal after successful update
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 border-b-2 border-gray-200 pb-4">Edit Profile</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password (optional)</label>
                        <input
                            type="password"
                            name="new_password"
                            value={form.new_password}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        {errors.new_password && <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>}
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                            disabled={Object.keys(errors).length > 0}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;