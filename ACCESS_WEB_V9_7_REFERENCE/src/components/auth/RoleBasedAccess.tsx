import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

interface RoleBasedAccessProps {
  /**
   * Array of user roles that are allowed to access the content
   */
  allowedRoles: UserRole[];
  
  /**
   * React children to render if user has permission
   */
  children: React.ReactNode;
  
  /**
   * Optional fallback content to display if user doesn't have permission
   * If not provided, nothing will be rendered for unauthorized users
   */
  fallback?: React.ReactNode;
}

/**
 * Component for conditionally rendering UI elements based on user role
 * 
 * Usage:
 * <RoleBasedAccess allowedRoles={['admin', 'developer']}>
 *   <AdminControls />
 * </RoleBasedAccess>
 */
const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({ 
  allowedRoles, 
  children, 
  fallback = null 
}) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  // If not authenticated, show fallback
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }
  
  // Check if user has one of the allowed roles
  const hasPermission = user && allowedRoles.includes(user.role);
  
  // Render children if user has permission, otherwise render fallback
  return <>{hasPermission ? children : fallback}</>;
};

export default RoleBasedAccess;