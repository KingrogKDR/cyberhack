import pino from "pino";
import pinoElasticsearch from 'pino-elasticsearch';

const streamToElastic = pinoElasticsearch({
    index: 'vaultguard-logs',
    node: 'http://elasticsearch:9200',
    esVersion: 8,
    serializer: (log) => {
        return {
            '@timestamp': new Date().toISOString(),
            ...log,
        };
    },
})

streamToElastic.on('error', (error) => {
    console.error('Elastic log error:', error?.message || error);
    if (error?.meta?.body?.error) {
        console.error('Meta error:', JSON.stringify(error.meta.body.error, null, 2));
    }
});

const logger = pino({ level: 'info' }, streamToElastic)
logger.info({ startup: true }, 'VaultGuard booted');

export default logger;