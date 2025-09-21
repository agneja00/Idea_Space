import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from "vite";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { visualizer } from "rollup-plugin-visualizer";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import svgr from "vite-plugin-svgr";
import { parsePublicEnv } from "./src/lib/parsePublicEnv";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const publicEnv = parsePublicEnv(env);

  if (env.HOST_ENV !== "local") {
    if (!env.SENTRY_AUTH_TOKEN) {
      console.warn("⚠️ SENTRY_AUTH_TOKEN is missing – Sentry plugin disabled.");
    }
    if (!env.SOURCE_VERSION) {
      console.warn("⚠️ SOURCE_VERSION is missing – release version not set.");
    }
  }

  const plugins = [
    react(),
    svgr(),
    legacy({ targets: ["> 0.01%"] }),
    ...(env.HOST_ENV === "local"
      ? [
          visualizer({
            filename: "./dist/bundle-stats.html",
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
    tsconfigPaths(),
    ...(env.SENTRY_AUTH_TOKEN && env.SOURCE_VERSION
      ? [
          sentryVitePlugin({
            org: "ideanickk",
            project: "idea-space-frontend",
            authToken: env.SENTRY_AUTH_TOKEN,
            release: { name: env.SOURCE_VERSION },
          }) as any,
        ]
      : []),
  ];

  return {
    plugins,
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
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
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 900,
    },
    server: {
      port: Number(env.PORT) || 8001,
      host: true,
    },
    preview: {
      port: Number(env.PORT) || 8001,
      host: true,
    },
    define: {
      "process.env": publicEnv,
    },
  };
});
