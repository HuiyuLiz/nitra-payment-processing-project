import "@quasar/extras/material-icons/material-icons.css";
import { Quasar } from "quasar";
import quasarLang from "quasar/lang/zh-TW";
import "quasar/src/css/index.sass";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App)
  .use(Quasar, {
    plugins: {},
    lang: quasarLang,
  })
  .mount("#app");
