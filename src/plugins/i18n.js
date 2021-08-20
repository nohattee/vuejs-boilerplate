import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context(
    "@/locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach((key) => {
    const matched1 = key.match(/\/([A-Za-z0-9-_]+)\//i);
    const matched2 = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched1 && matched1.length > 1 && matched2 && matched2.length > 1) {
      const data = {};
      data[matched2[1]] = locales(key);
      const locale = matched1[1];
      messages[locale] = { ...messages[locale], ...data };
    }
  });
  return messages;
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "en",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: loadLocaleMessages(),
});
