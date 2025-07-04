import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import NotificationPage from './pages/NotificationPage';
import ProfileModal from './components/ProfileModal';

function AppContent({ showProfileModal, setShowProfileModal }) {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 overflow-y-auto p-4">
          {showProfileModal && <ProfileModal isOpen={true} onClose={() => setShowProfileModal(false)} />}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <ProtectedRoute>
                  <TaskDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (location.pathname === '/profile' && user) {
      setShowProfileModal(true);
    } else {
      setShowProfileModal(false);
    }
  }, [location, user]);

  return (
    <AppContent showProfileModal={showProfileModal} setShowProfileModal={setShowProfileModal} />
  );
}

export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}