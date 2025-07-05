import { createClient } from 'redis';

const client = createClient({ url: 'redis://redis:6379' });

await client.connect().then(() => console.log('Redis connected')).catch((error) => console.error("Redis client error", error));

export default client