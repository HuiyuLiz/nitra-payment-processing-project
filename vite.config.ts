import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/nitra-payment-processing-project/",
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: "src/css/quasar.variables.scss",
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
