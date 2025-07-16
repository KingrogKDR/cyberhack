import axios from 'axios';
import { authUtils } from '../../utils/auth';
import type { 
  ConsentsResponse, 
  UsersResponse, 
  RevokeRequestResponse,
  ProcessRevokeRequest,
  ProcessRevokeResponse,
  RevokeRequest
} from '../../types';

export const consentApi = {
  // User: Get user's consents
  getUserConsents: async (): Promise<ConsentsResponse> => {
    console.log('🔄 Consent API - Get user consents request');
    
    try {
      const headers = authUtils.getAuthHeaders();
      console.log('🔄 Consent API - Using headers:', headers);
      
      const response = await axios.get('http://localhost:4000/api/consent/user', { headers });
      console.log('✅ Consent API - Get user consents success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Consent API - Get user consents failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Consent API - Get user consents error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  },

  // User: Request revoke consent
  requestRevoke: async (consentId: string): Promise<RevokeRequestResponse> => {
    console.log('🔄 Consent API - Request revoke for consent:', consentId);
    
    try {
      const headers = authUtils.getAuthHeaders();
      console.log('🔄 Consent API - Using headers:', headers);
      
      const response = await axios.post(`http://localhost:4000/api/revoke-request/${consentId}`, {}, { headers });
      console.log('✅ Consent API - Request revoke success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Consent API - Request revoke failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Consent API - Request revoke error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  },

  // Bank: Get all users
  getAllUsers: async (): Promise<UsersResponse> => {
    console.log('🔄 Consent API - Get all users request');
    
    try {
      const headers = authUtils.getAuthHeaders();
      console.log('🔄 Consent API - Using headers:', headers);
      
      const response = await axios.get('http://localhost:4000/user/users', { headers });
      console.log('✅ Consent API - Get all users success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Consent API - Get all users failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Consent API - Get all users error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  },

  // Bank: Get specific user's consents
  getUserConsentsById: async (userId: string): Promise<ConsentsResponse> => {
    console.log('🔄 Consent API - Get user consents by ID:', userId);
    
    try {
      const headers = authUtils.getAuthHeaders();
      console.log('🔄 Consent API - Using headers:', headers);
      
      const response = await axios.get(`http://localhost:4000/api/consent/bank/${userId}`, { headers });
      console.log('✅ Consent API - Get user consents by ID success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Consent API - Get user consents by ID failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Consent API - Get user consents by ID error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  },

  // Bank: Get all revoke requests
  getRevokeRequests: async (): Promise<RevokeRequest[]> => {
    console.log('🔄 Consent API - Get revoke requests');
    
    try {
      const headers = authUtils.getAuthHeaders();
      console.log('🔄 Consent API - Using headers:', headers);
      
      const response = await axios.get('http://localhost:4000/api/revoke-requests/pending', { headers });
      // console.log(response);
      console.log('✅ Consent API - Get revoke requests success:', response.data.pendingRequests);
      return response.data.pendingRequests;
    } catch (error) {
      console.error('❌ Consent API - Get revoke requests failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Consent API - Get revoke requests error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  },

  // Bank: Process revoke request (approve/reject)
  processRevokeRequest: async (data: ProcessRevokeRequest): Promise<ProcessRevokeResponse> => {
    console.log('🔄 Consent API - Process revoke request:', data);
    
    try {
      const headers = authUtils.getAuthHeaders();
      console.log('🔄 Consent API - Using headers:', headers);
      
      const response = await axios.post('http://localhost:4000/api/bank/revoke-status', data, { headers });
      console.log('✅ Consent API - Process revoke request success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Consent API - Process revoke request failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Consent API - Process revoke request error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  }
};