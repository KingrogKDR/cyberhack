import redisClient from "../utils/redis.js";

const sub = redisClient.duplicate()
await sub.connect()

await sub.configSet('notify-keyspace-events', 'Ex');
await sub.pSubscribe('__keyevent@0__:expired', async (expiredKey) => {
    if (!expiredKey.startsWith('vault:')) return

    const [, token] = expiredKey.split(":")
    await logger.info({
        event: 'token_expired',
        userId,
        field,
        token,
        renewable,
    }, 'Token expired. Awaiting reauthorization or audit if needed.');
    await redisClient.rPush('expired:queue', token);
})