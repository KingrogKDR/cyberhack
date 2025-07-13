import axios from 'axios';

const CONSENT_SERVICE_URL = process.env.CONSENT_SERVICE_URL || 'http://localhost:4000';

export async function checkConsent(userId: string, appId: string, field: string): Promise<boolean> {
  const res = await axios.get(`${CONSENT_SERVICE_URL}/api/consent/check`, {
    params: { userId, appId, field }
  });
  return res.data.allowed === true;
}
