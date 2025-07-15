import { useState, useEffect } from 'react';
import { Consent } from '../types';
import { consentApi } from '../api/consent';

export const useConsent = (token: string | null) => {
  const [consents, setConsents] = useState<Consent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserConsents = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await consentApi.getUserConsents(token);
      setConsents(response.consents);
    } catch (error) {
      console.error('Error fetching user consents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankUserConsents = async (userId: string) => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await consentApi.getBankUserConsents(token, userId);
      setConsents(response.consents);
    } catch (error) {
      console.error('Error fetching bank user consents:', error);
    } finally {
      setLoading(false);
    }
  };

  const revokeConsent = async (consentId: string) => {
    if (!token) return;
    
    try {
      await consentApi.revokeConsent(token, consentId);
      // Refresh consents after revocation
      await fetchUserConsents();
    } catch (error) {
      console.error('Error revoking consent:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserConsents();
    }
  }, [token]);

  return {
    consents,
    loading,
    fetchUserConsents,
    fetchBankUserConsents,
    revokeConsent,
  };
};