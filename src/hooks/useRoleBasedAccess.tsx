
import { useAuth } from "@/contexts/AuthContext";

type RoleMap<T> = {
  researcher?: T;
  grant_office?: T;
  admin?: T;
  default?: T;
};

/**
 * A hook to provide role-based access control for components and features
 */
export function useRoleBasedAccess() {
  const { user } = useAuth();
  
  /**
   * Returns whether the current user has permission for a specific action
   */
  const hasPermission = (allowedRoles: string[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };
  
  /**
   * Returns different values based on user role
   */
  const getRoleBasedValue = <T,>(roleMap: RoleMap<T>): T | undefined => {
    if (!user) return roleMap.default;
    
    switch (user.role) {
      case 'researcher':
        return roleMap.researcher ?? roleMap.default;
      case 'grant_office':
        return roleMap.grant_office ?? roleMap.default;
      case 'admin':
        return roleMap.admin ?? roleMap.default;
      default:
        return roleMap.default;
    }
  };
  
  /**
   * Checks if user is a researcher
   */
  const isResearcher = (): boolean => {
    return user?.role === 'researcher';
  };
  
  /**
   * Checks if user is a grant office member
   */
  const isGrantOffice = (): boolean => {
    return user?.role === 'grant_office';
  };
  
  /**
   * Checks if user is an admin
   */
  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  return {
    hasPermission,
    getRoleBasedValue,
    isResearcher,
    isGrantOffice,
    isAdmin,
    role: user?.role
  };
}
