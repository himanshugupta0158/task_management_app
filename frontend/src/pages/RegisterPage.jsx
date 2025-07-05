import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearAuthError } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: "",
        is_staff: false,
    });

    const status = useSelector((state) => state.auth.status);
    const error = useSelector((state) => state.auth.error);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCredentials({
            ...credentials,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async () => {
        try {
            await dispatch(register(credentials)).unwrap();
            navigate("/home");
        } catch (err) {
            // error handled in slice
        }
    };

    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <i className="fas fa-eye-slash"></i>
                            ) : (
                                <i className="fas fa-eye"></i>
                            )}
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="is_staff"
                            checked={credentials.is_staff}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_staff" className="text-gray-700">
                            Register as Staff
                        </label>
                    </div>
                    {status === "loading" && <p className="text-center text-gray-600">Registering...</p>}
                    {error && typeof error === "object" && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <ul className="list-disc list-inside">
                                {Object.entries(error).map(([field, messages]) =>
                                    Array.isArray(messages) ? (
                                        messages.map((msg, idx) => <li key={`${field}-${idx}`}>{msg}</li>)
                                    ) : (
                                        <li key={field}>{messages}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        disabled={status === "loading"}
                    >
                        Register
                    </button>
                    <p className="text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
