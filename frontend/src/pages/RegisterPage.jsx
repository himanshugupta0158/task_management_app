import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const status = useSelector((state) => state.auth.status);
    const error = useSelector((state) => state.auth.error);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await dispatch(register(credentials)).unwrap();
            navigate('/home');
        } catch (err) {
            // Error is handled by notificationSlice
        }
    };

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
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {status === 'loading' && <p className="text-center text-gray-600">Registering...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        disabled={status === 'loading'}
                    >
                        Register
                    </button>
                    <p className="text-center text-sm">
                        Already have an account?{' '}
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