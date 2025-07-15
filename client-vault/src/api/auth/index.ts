import axios from 'axios';
import type { 
  RegisterRequest, 
  RegisterResponse, 
  LoginRequest, 
  LoginResponse, 
  ProfileResponse 
} from '../../types';
import { authUtils } from '../../utils/auth';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    console.log('🔄 Auth API - Register request:', { ...data, password: '[HIDDEN]' });
    
    try {
      const response = await axios.post('http://localhost:4000/auth/register', data);
      console.log('✅ Auth API - Register success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Auth API - Register failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Auth API - Register error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    console.log('🔄 Auth API - Login request:', { email: data.email, password: '[HIDDEN]' });
    
    try {
      const response = await axios.post('http://localhost:4000/auth/login', data);
      console.log('✅ Auth API - Login success:', {
        message: response.data.message,
        user: response.data.user,
        tokenReceived: !!response.data.token
      });
      return response.data;
    } catch (error) {
      console.error('❌ Auth API - Login failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Auth API - Login error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  },

  getProfile: async (): Promise<ProfileResponse> => {
    console.log('🔄 Auth API - Get profile request');
    
    try {
      const headers = authUtils.getAuthHeaders();
      console.log('🔄 Auth API - Using headers:', headers);
      
      const response = await axios.get('http://localhost:4000/auth/profile', { headers });
      console.log('✅ Auth API - Get profile success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Auth API - Get profile failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ Auth API - Get profile error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  }
};