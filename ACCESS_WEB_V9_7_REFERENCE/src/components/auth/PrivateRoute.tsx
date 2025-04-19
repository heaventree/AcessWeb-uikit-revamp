import React, { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

interface PrivateRouteProps {
  // Allowed user roles for this route
  allowedRoles?: UserRole[];
  // Fallback redirect route if user is not authenticated or not authorized
  redirectTo?: string;
}

/**
 * PrivateRoute component that protects routes based on authentication and role authorization
 * 
 * Usage:
 * <Route element={<PrivateRoute allowedRoles={['admin']} />}>
 *   <Route path="/admin-dashboard" element={<AdminDashboard />} />
 * </Route>
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  allowedRoles = [], 
  redirectTo = '/login'
}) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div role="status" aria-live="polite">
          <svg className="w-12 h-12 text-gray-300 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="sr-only">Verifying authentication...</span>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save the current location for redirecting back after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If specific roles are required but user role doesn't match
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default PrivateRoute;