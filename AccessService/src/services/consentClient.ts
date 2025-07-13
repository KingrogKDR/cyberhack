import axios from "axios";

export async function checkConsent(
  userId: string,
  appId: string,
  field: string
): Promise<boolean> {
  try {
    const res = await axios.get(
      "http://consent-service:4000/api/consent/check",
      {
        params: { userId, appId, field },
      }
    );
    return res.data.allowed === true;
  } catch (error: any) {
    console.error("checkConsent error:", error.message || error);
    return false;
  }
}
