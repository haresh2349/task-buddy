import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy-loaded components
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Profile = lazy(() => import('../pages/Profile'));

const RouterConfig = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />

        {/* Private Routes */}
        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

        {/* Fallback Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default RouterConfig;