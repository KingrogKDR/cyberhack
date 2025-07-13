import axios from "axios";
import { createHmac } from "crypto";
import { Router } from "express";
import { decryptFields, encryptFields } from "../utils/cryptoUtils.js";
import logger from "../utils/logger.js";
import { maskValue } from "../utils/masker.js";
import redis from "../utils/redis.js";

const router = Router();

router.post("/tokenize", async (req, res) => {
  const { requestedData, userId, appId } = req.body;
  const tokens = {};

  for (const field in requestedData) {
    const fieldData = requestedData[field];
    if (!fieldData || typeof fieldData.value !== "string") {
      return res.status(400).json({ error: `Invalid or missing 'value' in field: ${field}` });
    }

    const { value, ttl = 5, mask = false, renewable = true } = fieldData;
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
      appId
    };

    await redis.setEx(`vault:${token}`, ttl * 60, JSON.stringify(payload));
    tokens[field] = token;

    logger.info({
      event: 'tokenize',
      userId,
      appId,
      field,
      ttl,
      mask,
      token,
      renewable,
    }, 'Token created')
  }

  res.status(200).json({ tokens });
});


router.post("/detokenize", async (req, res) => {
  const { tokens, appId, userId } = req.body;
  const result = {}
  for (const field in tokens) {
    const token = tokens[field];
    const raw = await redis.get(`vault:${token}`);

    if (!raw) {
      result[field] = 'EXPIRED';
      logger.warn({ event: 'detokenize', field, token }, 'Token expired');
      continue;
    }


    const { encrypted, key, iv, mask } = JSON.parse(raw);
    const value = decryptFields(encrypted, key, iv);
    result[field] = mask ? maskValue(value) : value;

    let allowed;
    try {
      const response = await axios.post("http://access-service:5000/api/access/validate", {
        userId,
        appId,
        field,
        purpose: "budgeting",
      });
      allowed = response.data.access;
    } catch (err) {
      logger.error({ error: err.message, field }, 'Access validation failed');
      return res.status(500).json({ error: `Access service unreachable for field: ${field}` });
    }


    if (!allowed) {
      const reason = response.data.reason || 'Unknown reason';
      res.status(403).json({ error: `Consent Policy Violated for ${field}: ${reason}` });
      return;
    }


    logger.info({
      event: 'detokenize',
      field,
      token,
      masked: mask,
      appId
    }, 'Token accessed');
  }
  res.status(200).json(result)
});




export default router
