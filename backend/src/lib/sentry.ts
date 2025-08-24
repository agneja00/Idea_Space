import * as Sentry from "@sentry/node";
import path from "path";
import { env } from "./env";
import type { LoggerMetaData } from "./logger";

const SENTRY_ENABLED = Boolean(env.BACKEND_SENTRY_DSN && env.SOURCE_VERSION);

if (SENTRY_ENABLED) {
  Sentry.init({
    dsn: env.BACKEND_SENTRY_DSN,
    environment: env.HOST_ENV,
    release: env.SOURCE_VERSION,
    normalizeDepth: 10,
    integrations: [
      Sentry.rewriteFramesIntegration({
        root: path.resolve(__dirname, "../../.."),
      }),
    ],
  });
}

export const sentryCaptureException = (error: Error, extraData?: LoggerMetaData) => {
  if (!SENTRY_ENABLED) return;
  Sentry.captureException(error, { extra: extraData });
};

export const sentryFlush = async (timeoutMs = 2000) => {
  if (!SENTRY_ENABLED) return;
  await Sentry.flush(timeoutMs);
};
