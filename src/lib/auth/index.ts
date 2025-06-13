// Authentication module index file

import { AuthProvider, useAuth } from './context';
import AuthService from './service';
import { protectRoute, withRoleProtection, useHasAccess, PermissionGate } from './middleware';
import * as types from './types';

// Export all authentication components
export {
  AuthProvider,
  useAuth,
  AuthService,
  protectRoute,
  withRoleProtection,
  useHasAccess,
  PermissionGate,
  types
};

// Export types directly for convenience
export const { UserRole, AuthErrorType } = types;

// Default export
export default {
  AuthProvider,
  useAuth,
  AuthService,
  protectRoute,
  withRoleProtection,
  useHasAccess,
  PermissionGate
};
