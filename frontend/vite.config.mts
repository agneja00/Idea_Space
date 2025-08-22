import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const publicEnv = Object.entries(env).reduce((acc, [key, value]) => {
    if (key.startsWith("VITE_") || ["NODE_ENV", "HOST_ENV", "SOURCE_VERSION"].includes(key)) {
      return {
        ...acc,
        [key]: value,
      };
    }
    return acc;
  }, {});

  if (env.HOST_ENV !== "local") {
    if (!env.SENTRY_AUTH_TOKEN) {
      throw new Error("SENTRY_AUTH_TOKEN is not defined");
    }
    if (!env.SOURCE_VERSION) {
      throw new Error("SOURCE_VERSION is not defined");
    }
  }

  return {
    plugins: [
      react(),
      svgr(),
      tsconfigPaths(),
      !env.SENTRY_AUTH_TOKEN
        ? undefined
        : sentryVitePlugin({
            org: "ideanick",
            project: "idea-space-frontend",
            authToken: env.SENTRY_AUTH_TOKEN,
            release: { name: env.SOURCE_VERSION },
          }),
    ],
    build: {
      sourcemap: true,
    },
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "include-media" as *;
            @use "reset-css/sass/reset" as *;
            @use "@/styles/_vars" as *;
            @use "@/styles/_mixins" as *;
          `,
        },
      },
    },
    server: {
      port: Number(env.PORT) || 5173,
    },
    preview: {
      port: Number(env.PORT) || 5173,
    },
    define: {
      "process.env": publicEnv,
    },
  };
});
