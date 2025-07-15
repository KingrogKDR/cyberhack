import { Alert } from '../../types';
import { sampleUserAlerts, sampleBankAlerts } from '../../sampleData/alerts';

const API_BASE_URL = 'http://localhost:4000';

export const alertsApi = {
  async getUserAlerts(token: string): Promise<Alert[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn('API request failed, using sample data');
        return sampleUserAlerts;
      }

      return await response.json();
    } catch (error) {
      console.error('Get user alerts error:', error);
      return sampleUserAlerts;
    }
  },

  async getBankAlerts(token: string, userId?: string): Promise<Alert[]> {
    try {
      const endpoint = userId 
        ? `${API_BASE_URL}/api/alerts/bank/${userId}`
        : `${API_BASE_URL}/api/alerts/bank`;
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn('API request failed, using sample data');
        return sampleBankAlerts;
      }

      return await response.json();
    } catch (error) {
      console.error('Get bank alerts error:', error);
      return sampleBankAlerts;
    }
  },
};