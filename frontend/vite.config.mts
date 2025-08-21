import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const publicEnv = Object.entries(env).reduce((acc, [key, value]) => {
    if (key.startsWith("VITE_") || key === "NODE_ENV") {
      return {
        ...acc,
        [key]: value,
      };
    }
    return acc;
  }, {});

  return {
    plugins: [react(), tsconfigPaths(), svgr()],
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
