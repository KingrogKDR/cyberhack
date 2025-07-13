import axios from "axios";

const POLICY_SERVICE_URL = process.env.POLICY_SERVICE_URL;

export async function checkPolicy(
  appId: string,
  field: string,
  purpose: string
): Promise<boolean> {
  try {
    const res = await axios.post(
      `${POLICY_SERVICE_URL}/v1/data/data_access/allow`,
      { input: { appId, field, purpose } }
    );
    return res.data.result === true;
  } catch (error: any) {
    console.error("checkPolicy error:", error.message || error);
    return false;
  }
}
