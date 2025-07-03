import axios from 'axios';

export async function checkConsent(userId: string, appId: string, field: string): Promise<boolean> {
  const res = await axios.get('http://localhost:4000/api/consent/check', {
    params: { userId, appId, field }
  });
  return res.data.allowed === true;
}
