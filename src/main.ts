import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router/index";
import "vue3-toastify/dist/index.css";
import Vue3Toastify from "vue3-toastify";
import "./style.css";
import App from "./App.vue";
import { createI18n } from "vue-i18n";
import enTranslations from "./translations/en";
import frTranslations from "./translations/fr";

const i18n = createI18n({
  legacy : false,
  locale: "fr" || navigator.language.split("-")[0],
  fallbackLocale: "fr",
  availableLocales : ["fr", "en"],
  messages: {
    en: enTranslations,
    fr: frTranslations,
  },
});
const store = createPinia();
const app = createApp(App);

app
  .use(i18n)
  .use(router)
  .use(store)
  .use(Vue3Toastify, { clearOnUrlChange: false })
  .mount("#app");
