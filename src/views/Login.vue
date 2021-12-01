<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" dense>
          <v-col cols="12" sm="8" md="5" lg="5">
            <v-container>
              <v-card elevation="5">
                <v-card-title>
                  <div class="mx-auto">
                    <h2>{{ $t("global.login") }}</h2>
                  </div>
                </v-card-title>

                <v-card-text class="text-center">
                  <validation-observer ref="observer" v-slot="{ invalid }">
                    <form @submit.prevent="handleLogin">
                      <validation-provider
                        v-slot="{ errors }"
                        :name="$t('user.email')"
                        rules="required"
                      >
                        <v-text-field
                          v-model="form.email"
                          prepend-icon="mdi-email"
                          :label="$t('user.email')"
                          :error-messages="errors"
                          required
                        ></v-text-field>
                      </validation-provider>
                      <validation-provider
                        v-slot="{ errors }"
                        :name="$t('user.password')"
                        rules="required"
                      >
                        <v-text-field
                          v-model="form.password"
                          prepend-icon="mdi-lock"
                          :append-icon="
                            showPassword ? 'mdi-eye' : 'mdi-eye-off'
                          "
                          :label="$t('user.password')"
                          :error-messages="errors"
                          :type="showPassword ? 'text' : 'password'"
                          required
                          @click:append="showPassword = !showPassword"
                        ></v-text-field>
                      </validation-provider>
                      <v-row justify="center">
                        <v-btn
                          color="primary"
                          type="submit"
                          :loading="loading"
                          :disabled="invalid"
                        >
                          {{ $t("global.login") }}
                        </v-btn>
                      </v-row>
                    </form>
                  </validation-observer>
                </v-card-text>
                <v-card-actions>
                  <div class="locale">
                    <Locale />
                  </div>
                </v-card-actions>
              </v-card>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Locale from "@/components/Locale";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "Login",
  components: {
    ValidationProvider,
    ValidationObserver,
    Locale,
  },
  data() {
    return {
      redirect: undefined,
      showPassword: false,
      loading: false,
      otherQuery: {},
      form: {
        email: "",
        password: "",
      },
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.$store
        .dispatch("currentUser/login", this.form)
        .then(() => {
          this.$router.push({
            path: this.redirect || "/",
            query: this.otherQuery,
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style scoped>
.locale {
  width: 100px;
}
</style>
