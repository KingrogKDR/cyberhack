import pino, { Logger } from "pino";
import pinoElasticsearch, {
  Options as PinoElasticsearchOptions,
} from "pino-elasticsearch";

interface VaultGuardLog {
  startup?: boolean;
  [key: string]: any;
}

const streamToElastic = pinoElasticsearch({
  index: "vaultguard-consent-logs",
  node: "http://elasticsearch:9200",
  esVersion: 8,
  serializer: (log: VaultGuardLog): Record<string, any> => ({
    "@timestamp": new Date().toISOString(),
    ...log,
  }),
} as PinoElasticsearchOptions);

streamToElastic.on("error", (error: any) => {
  console.error("Elastic log error:", error?.message || error);
  if (error?.meta?.body?.error) {
    console.error(
      "Meta error:",
      JSON.stringify(error.meta.body.error, null, 2)
    );
  }
});

const logger: Logger = pino({ level: "info" }, streamToElastic);

logger.info({ startup: true }, "VaultGuard booted");

export default logger;
