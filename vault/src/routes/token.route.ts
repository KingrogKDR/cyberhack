import axios from "axios";
import { createHmac } from "crypto";
import { Request, Response, Router } from "express";
import { decryptFields, encryptFields } from "../utils/cryptoUtils";
import logger from "../utils/logger";
import { maskValue } from "../utils/masker";
import redis from "../utils/redis";

interface FieldData {
  value: string;
  ttl: number;
  mask?: boolean;
  renewable?: boolean;
}

interface TokenRequestBody {
  requestedData: Record<string, FieldData>;
  userId: string;
  appId: string;
}

interface DetokenizeRequestBody {
  tokens: Record<string, string>;
  userId: string;
  appId: string;
}

interface AccessResponse {
  access: boolean;
  reason?: string;
}

interface TokenPayload {
  encrypted: string;
  key: string;
  iv: string;
  expiresAt: number;
  mask?: boolean;
  appId: string;
  userId: string;
}

const router = Router();

router.post(
  "/tokenize",
  async (req: Request<{}, {}, TokenRequestBody>, res: Response) => {
    const { requestedData, userId, appId } = req.body;
    const tokens: Record<string, string> = {};

    for (const field in requestedData) {
      const fieldData = requestedData[field];
      if (!fieldData || typeof fieldData.value !== "string") {
        return res
          .status(400)
          .json({ error: `Invalid or missing 'value' in field: ${field}` });
      }

      const { value, ttl, mask = false, renewable = true } = fieldData;
      const { encrypted, keys } = encryptFields({ [field]: value });

      const token = createHmac("sha256", userId)
        .update(field + Date.now())
        .digest("hex");

      const { iv, value: encryptedValue } = encrypted[field];
      const key = keys[field];

      const expiresAt = Date.now() + ttl * 60 * 1000;
      const payload = {
        encrypted: encryptedValue,
        key,
        iv,
        expiresAt,
        mask,
        appId,
        userId,
      };

      await redis.setEx(`vault:${token}`, ttl * 60, JSON.stringify(payload));

      tokens[field] = token;

      logger.info(
        {
          event: "tokenize",
          userId,
          appId,
          field,
          ttl,
          mask,
          token,
          renewable,
        },
        "Token created"
      );
    }

    res.status(200).json({ tokens });
  }
);

router.post(
  "/detokenize",
  async (req: Request<{}, {}, DetokenizeRequestBody>, res: Response) => {
    const { tokens, appId, userId } = req.body;
    const result: Record<string, string> = {};

    for (const field in tokens) {
      const token = tokens[field];
      const raw = await redis.get(`vault:${token}`);

      if (!raw) {
        result[field] = "EXPIRED";
        logger.warn({ event: "detokenize", field, token }, "Token expired");
        continue;
      }

      const { encrypted, key, iv, mask } = JSON.parse(raw) as TokenPayload;
      const value = decryptFields(encrypted, key, iv);
      result[field] = mask ? maskValue(value) : value;

      let allowed: boolean = false;
      let reason = "";
      try {
        const consentResponse = await axios.post<AccessResponse>(
          "http://access-service:5000/api/access/validate",
          {
            userId,
            appId,
            field,
            purpose: "budgeting",
          }
        );
        allowed = consentResponse.data.access;
        reason = consentResponse.data.reason || "";
      } catch (err: any) {
        logger.error({ error: err.message, field }, "Access validation failed");
        return res
          .status(500)
          .json({ error: `Access service unreachable for field: ${field}` });
      }

      if (!allowed) {
        res
          .status(403)
          .json({ error: `Consent Policy Violated for ${field}: ${reason}` });
        return;
      }

      logger.info(
        {
          event: "detokenize",
          field,
          token,
          masked: mask,
          appId,
        },
        "Token accessed"
      );
    }
    res.status(200).json(result);
  }
);

export default router;
