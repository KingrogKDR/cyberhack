import axios from "axios";
import express from "express";
import { prisma } from "../prisma";

const router = express.Router();

<<<<<<< HEAD
interface ConsentCheckResponse {
  allowed: boolean;
}

interface TokenizeResponse {
  tokens: Record<string, string>;
}

||||||| 50479be
=======
//definig interfaces here
interface ConsentResponse {
  allowed: boolean;
}

interface TokenizeResponse {
  tokens: Record<string, string>;
}

>>>>>>> 3bf4717cb9d4d2ff613a0cebf11853cf96f1665f
/**
 * POST /bank/data
 * {
 *   email: string,
 *   fields: string[],
 *   appId: string
 * }
 */
router.post("/", async (req, res) => {
  const { email, fields, appId } = req.body;

  if (!email || !Array.isArray(fields) || !appId) {
    return res
      .status(400)
      .json({ message: "Missing or invalid email, fields, or appId" });
  }

  try {
    // Step 1: Find user & account
    const user = await prisma.user.findUnique({
      where: { email },
      include: { accountDetail: true },
    });

    if (!user || !user.accountDetail) {
      return res.status(404).json({ message: "User or account not found" });
    }

    const account = user.accountDetail;

    // Step 2: Loop over each field → check consent → include only if allowed
    const requestedData: Record<string, any> = {};
    const allowedFields: string[] = [];

    for (const field of fields) {
      // Consent check
<<<<<<< HEAD
      const consentRes = await axios.get<ConsentCheckResponse>(
||||||| 50479be
      const consentRes = await axios.get(
=======
      const consentRes = await axios.get<ConsentResponse>(
>>>>>>> 3bf4717cb9d4d2ff613a0cebf11853cf96f1665f
        `${process.env.CONSENT_SERVICE_URL}/api/consent/check`,
        {
          params: {
            userId: user.id,
            appId,
            field,
          },
        }
      );

      if (consentRes.data.allowed !== true) {
        console.log(`Consent denied for field: ${field}`);
        continue;
      }

      const value = (account as any)[field];
      if (value === undefined) continue;

      // Add to tokenization request
      requestedData[field] = {
        value: String(value),
        ttl: 5,
        mask: true,
        renewable: true,
      };

      allowedFields.push(field);
    }

    console.log(requestedData);

    if (Object.keys(requestedData).length === 0) {
      return res.status(403).json({ message: "No fields allowed by consent" });
    }

    // Step 3: Tokenize allowed fields
<<<<<<< HEAD
    const tokenRes = await axios.post<TokenizeResponse>(
      `${process.env.VAULT_SERVICE_URL}/api/v1/tokenize`,
||||||| 50479be
    const tokenRes = await axios.post(
      `${process.env.VAULT_SERVICE_URL}/api/v1/tokenize`,
=======
    const tokenRes = await axios.post<TokenizeResponse>(
      `http://localhost:8963/api/v1/tokenize`,
>>>>>>> 3bf4717cb9d4d2ff613a0cebf11853cf96f1665f
      {
        requestedData,
        userId: user.id,
        appId,
      }
    );

    return res.json({
      tokenizedFields: tokenRes.data.tokens,
      allowedFields,
    });
  } catch (err: any) {
    console.error("Tokenization failed:", err);
    return res.status(500).json({
      message: "Failed to fetch or tokenize data",
      error: err?.response?.data || err.message,
    });
  }
});

export default router;
