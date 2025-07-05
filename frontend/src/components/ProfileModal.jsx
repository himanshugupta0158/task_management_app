import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../redux/slices/authSlice";

function ProfileModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const status = useSelector((state) => state.auth.status);
    const error = useSelector((state) => state.auth.error);
    const [form, setForm] = useState({
        username: user?.username || "",
        email: user?.email || "",
    });

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username,
                email: user.email,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        dispatch(updateUserProfile(form)).then(() => {
            onClose();
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {status === "loading" && <p className="text-center text-gray-600">Saving...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
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
                            disabled={status === "loading"}
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