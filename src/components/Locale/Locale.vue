<template>
  <v-select
    v-model="selectedLocale"
    :items="locales"
    item-text="name"
    item-value="value"
    dense
    v-bind="$attrs"
    prepend-inner-icon="mdi-translate"
    @change="setLocale(selectedLocale)"
  >
    <template v-slot:selection="{ item }">
      {{ item.value.toUpperCase() }}
    </template>
  </v-select>
</template>

<script>
export default {
  name: "Locale",
  data() {
    return {
      selectedLocale: this.$i18n.locale,
    };
  },
  computed: {
    locales() {
      return [
        { name: this.$t("global.english"), value: "en" },
        { name: this.$t("global.vietnam"), value: "vi" },
      ];
    },
  },
  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale;
    },
  },
};
</script>
