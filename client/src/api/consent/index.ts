import { Consent } from '../../types';
import { sampleUserConsents } from '../../sampleData/userConsents';

const API_BASE_URL = 'http://localhost:4000';

export const consentApi = {
  async getUserConsents(token: string): Promise<{ consents: Consent[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/consent/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn('API request failed, using sample data');
        return sampleUserConsents;
      }

      return await response.json();
    } catch (error) {
      console.error('Get user consents error:', error);
      return sampleUserConsents;
    }
  },

  async getBankUserConsents(token: string, userId: string): Promise<{ consents: Consent[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/consent/bank/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn('API request failed, using sample data');
        return sampleUserConsents;
      }

      return await response.json();
    } catch (error) {
      console.error('Get bank user consents error:', error);
      return sampleUserConsents;
    }
  },

  async revokeConsent(token: string, consentId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/revoke-request/${consentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to revoke consent');
      }

      return await response.json();
    } catch (error) {
      console.error('Revoke consent error:', error);
      throw error;
    }
  },
};