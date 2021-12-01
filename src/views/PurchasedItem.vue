<template>
  <v-data-table
    :headers="headers"
    :items="purchasedItems"
    :search="search"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ $t("global.purchased_item") }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              {{ $t("purchased_item.new_item") }}
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
                          :name="$t('purchased_item.name')"
                          rules="required"
                        >
                          <v-text-field
                            v-model="editedItem.name"
                            :label="$t('purchased_item.name')"
                            :error-messages="errors"
                            required
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12">
                        <validation-provider
                          v-slot="{ errors }"
                          :name="$t('purchased_item.price')"
                          rules="required|numeric"
                        >
                          <v-text-field
                            v-model="editedItem.price"
                            :label="$t('purchased_item.price')"
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
    <template v-slot:item.price="{ item }">
      {{ formatPrice(item.price) }}₫
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        {{ $t("global.reset") }}
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import purchasedItemAPI from "@/api/purchased-item";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "PurchasedItem",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      search: "",
      dialog: false,
      dialogDelete: false,
      purchasedItems: [],
      editedIndex: -1,
      editedItem: {
        id: "",
        name: "",
        price: "",
      },
      defaultItem: {
        id: "",
        name: "",
        price: "",
      },
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("purchased_item.name"),
          align: "start",
          value: "name",
        },
        { text: this.$t("purchased_item.price"), value: "price" },
        { text: this.$t("global.actions"), value: "actions", sortable: false },
      ];
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("purchased_item.new_item")
        : this.$t("purchased_item.edit_item");
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
      try {
        this.fetchPurchasedItems();
      } catch (err) {
        console.log(err);
      }
    },
    async fetchPurchasedItems() {
      const res = await purchasedItemAPI.list();
      this.purchasedItems = res.data.items;
    },
    editItem(item) {
      this.editedIndex = this.purchasedItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.purchasedItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.purchasedItems.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
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
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    async save() {
      try {
        if (this.editedIndex > -1) {
          await purchasedItemAPI.update(this.editedItem);
          Object.assign(this.purchasedItems[this.editedIndex], this.editedItem);
        } else {
          await purchasedItemAPI.create(this.editedItem);
          this.purchasedItems.push(this.editedItem);
        }
      } catch (e) {
        console.error(e);
      }
      this.close();
    },
  },
};
</script>
