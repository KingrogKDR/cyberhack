import pino, { Logger } from 'pino';
import pinoElasticsearch, { Options as PinoElasticsearchOptions } from 'pino-elasticsearch';

// Define the expected shape of logs, optionally extend as needed
interface VaultGuardLog {
  startup?: boolean;
  [key: string]: any;
}

const streamToElastic = pinoElasticsearch({
  index: 'vaultguard-logs',
  node: 'http://elasticsearch:9200',
  esVersion: 8,
  serializer: (log: VaultGuardLog): Record<string, any> => ({
    '@timestamp': new Date().toISOString(),
    ...log,
  }),
} as PinoElasticsearchOptions); // Explicit cast to satisfy TS

// Handle errors cleanly with full typing
streamToElastic.on('error', (error: any) => {
  console.error('Elastic log error:', error?.message || error);
  if (error?.meta?.body?.error) {
    console.error('Meta error:', JSON.stringify(error.meta.body.error, null, 2));
  }
});

const logger: Logger = pino({ level: 'info' }, streamToElastic);

logger.info({ startup: true }, 'VaultGuard booted');

export default logger;
