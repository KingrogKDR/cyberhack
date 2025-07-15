import { User } from '../../types';
import { sampleAllUsers } from '../../sampleData/allUsers';

const API_BASE_URL = 'http://localhost:4000';

export const usersApi = {
  async getAllUsers(token: string): Promise<{ users: User[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn('API request failed, using sample data');
        return sampleAllUsers;
      }

      return await response.json();
    } catch (error) {
      console.error('Get all users error:', error);
      return sampleAllUsers;
    }
  },
};