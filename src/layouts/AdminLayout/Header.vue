<template>
  <v-app-bar app absolute color="primary">
    <v-spacer></v-spacer>

    <v-row justify="end" align="center">
      <v-col cols="2" sm="3" md="3" lg="2">
        <Locale solo class="locale mt-6" />
      </v-col>
      <v-col cols="2">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon dark v-bind="attrs" v-on="on">
              <v-icon large> mdi-account-circle </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="logout">
              <v-list-item-title>{{ $t("global.logout") }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import Locale from "@/components/Locale";
export default {
  name: "Header",
  components: {
    Locale,
  },
  data() {
    return {
      selectedLocale: this.$i18n.locale,
      locales: [
        { name: "global.english", value: "en" },
        { name: "global.vietnam", value: "vi" },
      ],
    };
  },
  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale;
    },
    logout() {
      this.$store.dispatch("currentUser/logout");
      this.$router.push({ name: "Login" });
    },
  },
};
</script>
