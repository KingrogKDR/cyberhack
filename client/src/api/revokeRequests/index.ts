import { RevokeRequest } from '../../types';
import { sampleRevokeRequests } from '../../sampleData/revokeRequests';

const API_BASE_URL = 'http://localhost:4000';

export const revokeRequestApi = {
  async getRevokeRequests(token: string): Promise<RevokeRequest[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bank/revoke-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn('API request failed, using sample data');
        return sampleRevokeRequests;
      }

      return await response.json();
    } catch (error) {
      console.error('Get revoke requests error:', error);
      return sampleRevokeRequests;
    }
  },

  async processRevokeRequest(token: string, revokeRequestId: string, status: 'approved' | 'rejected'): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bank/revoke-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          revokeRequestId,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process revoke request');
      }

      return await response.json();
    } catch (error) {
      console.error('Process revoke request error:', error);
      throw error;
    }
  },
};