import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

// Define permission types for the application
export type Permission = 
  // Audit permissions
  | 'audit:create' 
  | 'audit:read' 
  | 'audit:update' 
  | 'audit:delete'
  // Report permissions 
  | 'report:create'
  | 'report:read'
  | 'report:update'
  | 'report:delete'
  // User management permissions
  | 'user:create'
  | 'user:read'
  | 'user:update'
  | 'user:delete'
  // System permissions
  | 'system:settings'
  | 'system:logs';

// Role-permission mapping
const rolePermissions: Record<string, Permission[]> = {
  admin: [
    'audit:create', 'audit:read', 'audit:update', 'audit:delete',
    'report:create', 'report:read', 'report:update', 'report:delete',
    'user:create', 'user:read', 'user:update', 'user:delete',
    'system:settings', 'system:logs'
  ],
  user: [
    'audit:create', 'audit:read', 'audit:update',
    'report:create', 'report:read', 'report:update',
  ],
  guest: [
    'audit:read',
    'report:read'
  ],
  developer: [
    'audit:create', 'audit:read', 'audit:update', 'audit:delete',
    'report:create', 'report:read', 'report:update', 'report:delete',
    'system:logs'
  ]
};

interface PermissionCheckProps {
  /**
   * Required permission(s) to view the content
   * If multiple permissions are provided, user must have ALL of them
   */
  permissions: Permission | Permission[];
  
  /**
   * Children to render if user has permission
   */
  children: React.ReactNode;
  
  /**
   * Optional fallback content to display if user doesn't have permission
   * If not provided, nothing will be rendered for unauthorized users
   */
  fallback?: React.ReactNode;
}

/**
 * Component for conditionally rendering UI elements based on specific permissions
 * 
 * Usage:
 * <PermissionCheck permissions="audit:create">
 *   <CreateAuditButton />
 * </PermissionCheck>
 */
const PermissionCheck: React.FC<PermissionCheckProps> = ({ 
  permissions, 
  children, 
  fallback = null 
}) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  // If not authenticated, show fallback
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }
  
  // Get permissions for the user's role
  const userPermissions = rolePermissions[user.role] || [];
  
  // Check if user has all required permissions
  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
  const hasAllPermissions = requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
  
  // Render children if user has all required permissions, otherwise render fallback
  return <>{hasAllPermissions ? children : fallback}</>;
};

export default PermissionCheck;