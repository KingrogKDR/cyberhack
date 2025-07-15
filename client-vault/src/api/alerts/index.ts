import axios from 'axios';
import { authUtils } from '../../utils/auth';
import type { Alert, User } from '../../types';

export const alertsApi = {
  // User: Get user alerts (dummy endpoint for now)
  getUserAlerts: async (): Promise<Alert[]> => {
    console.log('🔄 Alerts API - Get user alerts request');
    
    try {
      const headers = authUtils.getAuthHeaders();
      console.log('🔄 Alerts API - Using headers:', headers);
      
      const response = await axios.get('http://localhost:4000/api/alerts/user', { headers });
      console.log('✅ Alerts API - Get user alerts success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Alerts API - Get user alerts failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Alerts API - Get user alerts error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  },

  // Bank: Get all users for alerts (dummy endpoint for now)
  getAllUsersForAlerts: async (): Promise<{ users: User[] }> => {
    console.log('🔄 Alerts API - Get all users for alerts');
    
    try {
      const headers = authUtils.getAuthHeaders();
      console.log('🔄 Alerts API - Using headers:', headers);
      
      const response = await axios.get('http://localhost:4000/api/alerts/users', { headers });
      console.log('✅ Alerts API - Get all users for alerts success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Alerts API - Get all users for alerts failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Alerts API - Get all users for alerts error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  },

  // Bank: Get alerts for specific user (dummy endpoint for now)
  getUserAlertsById: async (userId: string): Promise<Alert[]> => {
    console.log('🔄 Alerts API - Get user alerts by ID:', userId);
    
    try {
      const headers = authUtils.getAuthHeaders();
      console.log('🔄 Alerts API - Using headers:', headers);
      
      const response = await axios.get(`http://localhost:4000/api/alerts/user/${userId}`, { headers });
      console.log('✅ Alerts API - Get user alerts by ID success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Alerts API - Get user alerts by ID failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Alerts API - Get user alerts by ID error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  }
};