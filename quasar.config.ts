import { configure } from "quasar/wrappers";

export default configure(() => ({
  css: ["src/css/quasar-variables.scss"],

  build: {
    scss: {
      additionalData: `@import "src/css/quasar-variables.scss";`,
    },
  },
}));
