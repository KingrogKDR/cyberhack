import axios from 'axios';

export async function checkPolicy(appId: string, field: string, purpose: string): Promise<boolean> {
  const res = await axios.post('http://localhost:8181/v1/data/data_access/allow', {
    input: { appId, field, purpose }
  });
  return res.data.result === true;
}
