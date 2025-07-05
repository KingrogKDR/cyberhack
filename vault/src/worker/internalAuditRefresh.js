import { decryptFields } from "../utils/cryptoUtils.js";
import logger from "../utils/logger.js";
import redisClient from "../utils/redis.js";

export async function tryInternalRefresh(token) {
    const metaKey = `meta:${token}`
    const metaRaw = await redisClient.get(metaKey)
    if (!metaRaw) return { status: 'error', reason: 'not_found' };

    const { userId, field, encrypted, key } = JSON.parse(metaRaw)

    const value = decryptFields(encrypted, key)

    logger.info({
        event: "internal-refresh",
        userId,
        field,
        token,
        decryptedFor: 'audit',
        masked: value.length > 4 ? value.slice(0, 2) + '****' : '****',
    }, 'Performed internal audit decryption')

    return { status: 'ok', field, masked };

}

