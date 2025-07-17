import { cookieUtils } from './cookies';
import type { User } from '../types';

export const authUtils = {
  isAuthenticated: (): boolean => {
    const token = cookieUtils.getToken();
    const isAuth = !!token;
    console.log('🔄 Auth Utils - Check authentication:', { hasToken: isAuth });
    return isAuth;
  },

  getCurrentUser: (): User | null => {
    const user = cookieUtils.getUser();
    console.log('🔄 Auth Utils - Get current user:', user ? { id: user.id, email: user.email, role: user.role } : null);
    return user;
  },

  logout: () => {
    console.log('🔄 Auth Utils - Logging out user');
    cookieUtils.clearAuth();
    console.log('✅ Auth Utils - User logged out successfully');
  },

  getAuthHeaders: () => {
    const token = cookieUtils.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    console.log('🔄 Auth Utils - Get auth headers:', { hasAuthHeader: !!headers.Authorization });
    return headers;
  }
};