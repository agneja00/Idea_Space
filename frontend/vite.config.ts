import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
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
});
