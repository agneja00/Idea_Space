import * as Sentry from "@sentry/node";
import path from "path";
import { env } from "./env";
import type { LoggerMetaData } from "./logger";

const isSentryEnabled = env.BACKEND_SENTRY_DSN && env.NODE_ENV !== "test";

if (isSentryEnabled) {
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
  if (!isSentryEnabled) return;
  Sentry.captureException(error, { extra: extraData });
};

export const sentryFlush = async (timeoutMs = 2000) => {
  if (!isSentryEnabled) return;
  await Sentry.flush(timeoutMs);
};
