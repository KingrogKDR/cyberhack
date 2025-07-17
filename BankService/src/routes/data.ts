import axios from "axios";
import express from "express";
import { prisma } from "../prisma";

const router = express.Router();

interface ConsentCheckResponse {
  allowed: boolean;
}

interface TokenizeResponse {
  tokens: Record<string, string>;
}

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
      const consentRes = await axios.get<ConsentCheckResponse>(
        `${process.env.CONSENT_SERVICE_URL}/api/consent/check`,
        {
          params: {
            userId: user.id,
            appId,
            field,
          },
        }
      );
      // console.log(consentRes);

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

    if (Object.keys(requestedData).length === 0) {
      return res.status(403).json({ message: "No fields allowed by consent" });
    }

    // Step 3: Tokenize allowed fields
    const tokenRes = await axios.post<TokenizeResponse>(
      `${process.env.VAULT_SERVICE_URL}/api/v1/tokenize`,
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
