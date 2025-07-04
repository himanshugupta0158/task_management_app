import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isRegister = location.pathname === '/register';
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const status = useSelector((state) => state.auth.status);
    const error = useSelector((state) => state.auth.error);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (isRegister) {
                // Placeholder for registration (to be implemented with backend)
                alert('Registration not implemented yet. Please use login with username: admin, password: password.');
                return;
            }
            await dispatch(login(credentials)).unwrap();
            navigate('/tasks');
        } catch (err) {
            // Error is handled by notificationSlice
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">{isRegister ? 'Register' : 'Login'}</h2>
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
                    {status === 'loading' && <p className="text-center text-gray-600">{isRegister ? 'Registering...' : 'Logging in...'}</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        disabled={status === 'loading'}
                    >
                        {isRegister ? 'Register' : 'Login'}
                    </button>
                    <p className="text-center text-sm">
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <Link to={isRegister ? '/login' : '/register'} className="text-blue-600 hover:underline">
                            {isRegister ? 'Login' : 'Register'}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;