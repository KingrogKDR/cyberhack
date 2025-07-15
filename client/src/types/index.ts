export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'bank';
  createdAt: string;
  updatedAt: string;
}

export interface Consent {
  id: string;
  userId: string;
  appId: string;
  dataFields: string[];
  purpose: string;
  expiresAt: string;
  revoked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RevokeRequest {
  id: string;
  consentId: string;
  userId: string;
  userName?: string;
  appId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  userId: string;
  field: string;
  count: number;
  timestamp: string;
  companyId: string | null;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'bank';
}

export interface LoginRequest {
  email: string;
  password: string;
}