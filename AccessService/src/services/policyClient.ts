import axios from "axios";

export async function checkPolicy(
  appId: string,
  field: string,
  purpose: string
): Promise<boolean> {
  try {
    const res = await axios.post(
      "http://policy-service:8181/v1/data/data_access/allow",
      { input: { appId, field, purpose } }
    );
    return res.data.result === true;
  } catch (error: any) {
    console.error("checkPolicy error:", error.message || error);
    return false;
  }
}
