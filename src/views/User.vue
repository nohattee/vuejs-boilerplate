<template>
  <v-data-table
    :headers="headers"
    :items="users"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ $t("global.user") }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              {{ $t("user.new_item") }}
            </v-btn>
          </template>
          <v-card>
            <v-toolbar color="primary" dark>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
            </v-toolbar>

            <validation-observer ref="observer" v-slot="{ invalid }">
              <form @submit.prevent="save">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <validation-provider
                          v-slot="{ errors }"
                          :name="$t('user.full_name')"
                          rules="required"
                        >
                          <v-text-field
                            v-model="editedItem.full_name"
                            :label="$t('user.full_name')"
                            :error-messages="errors"
                            required
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12">
                        <validation-provider
                          v-slot="{ errors }"
                          :name="$t('user.full_name')"
                          rules="required|email"
                        >
                          <v-text-field
                            v-model="editedItem.email"
                            :label="$t('user.email')"
                            :error-messages="errors"
                            required
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12">
                        <validation-provider
                          v-slot="{ errors }"
                          vid="password"
                          :name="$t('user.password')"
                          rules="required|min:6"
                        >
                          <v-text-field
                            v-model="editedItem.password"
                            :label="$t('user.password')"
                            :error-messages="errors"
                            required
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12">
                        <validation-provider
                          v-slot="{ errors }"
                          :name="$t('user.password_confirmation')"
                          rules="confirmed:password"
                        >
                          <v-text-field
                            v-model="editedItem.password_confirmation"
                            :label="$t('user.password_confirmation')"
                            :error-messages="errors"
                            required
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    {{ $t("global.cancel") }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    type="submit"
                    :disabled="invalid"
                    text
                  >
                    {{ $t("global.ok") }}
                  </v-btn>
                </v-card-actions>
              </form>
            </validation-observer>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        {{ $t("global.reset") }}
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import userAPI from "@/api/user";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "User",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      users: [],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        user_id: "",
        full_name: "",
        email: "",
        password: "",
      },
      defaultItem: {
        user_id: "",
        full_name: "",
        email: "",
        password: "",
      },
    };
  },

  computed: {
    headers() {
      return [
        {
          text: this.$t("user.user_id"),
          align: "start",
          sortable: false,
          value: "user_id",
        },
        { text: this.$t("user.full_name"), value: "name" },
        { text: this.$t("user.email"), value: "email" },
        { text: this.$t("global.actions"), value: "actions", sortable: false },
      ];
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("user.new_item")
        : this.$t("user.edit_item");
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  async created() {
    await this.initialize();
  },

  methods: {
    async initialize() {
      const res = await userAPI.list();
      this.users = res.data.users;
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign(
        {},
        {
          ...item,
          password: "",
          password_confirmation: "",
        }
      );
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedItem.password = "";
        this.editedItem.password_confirmation = "";
        this.editedIndex = -1;
        this.$refs.observer.reset();
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      try {
        if (this.editedIndex > -1) {
          await userAPI.update(this.editedItem);
          Object.assign(this.users[this.editedIndex], this.editedItem);
        } else {
          await userAPI.create(this.editedItem);
          this.users.push(this.editedItem);
        }
      } catch (e) {
        console.error(e);
      }
      this.close();
    },
  },
};
</script>
