import axios from 'axios';

const POLICY_SERVICE_URL = process.env.POLICY_SERVICE_URL || 'http://localhost:8181';

export async function checkPolicy(appId: string, field: string, purpose: string): Promise<boolean> {
  const res = await axios.post(`${POLICY_SERVICE_URL}/v1/data/data_access/allow`, {
    input: { appId, field, purpose }
  });
  return res.data.result === true;
}
