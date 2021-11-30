<template>
  <v-card>
    <v-card-title class="indigo white--text text-h5">
      {{ $t("global.post_category") }}
    </v-card-title>
    <v-row class="pa-4" justify="space-between">
      <v-col cols="4">
        <v-treeview
          :active.sync="active"
          :items="categories"
          item-children="descendants"
          color="warning"
          activatable
          transition
          return-object
        >
        </v-treeview>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col class="d-flex text-center">
        <v-scroll-y-transition mode="out-in">
          <v-card
            class="pt-6 mx-auto"
            flat
            :key="selectedCategory ? selectedCategory.id : 0"
          >
            <v-window v-model="step">
              <v-window-item :value="1">
                <v-card-text class="d-flex flex-column justify-center">
                  <v-btn class="mb-3" color="primary" @click="createItem()">{{
                    addBtnTitle
                  }}</v-btn>
                  <v-btn v-if="selectedCategory" @click="editItem(active[0])">{{
                    $t("post_category.edit_item")
                  }}</v-btn>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="2">
                <validation-observer ref="observer" v-slot="{ invalid }">
                  <form @submit.prevent="save">
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <validation-provider
                              v-slot="{ errors }"
                              :name="$t('post_category.name')"
                              rules="required"
                            >
                              <v-text-field
                                @change="
                                  if (editedItem.slug === '')
                                    editedItem.slug = editedItem.name
                                      .toLowerCase()
                                      .normalize('NFD')
                                      .replace(/đ/g, 'd')
                                      .replace(/[\u0300-\u036f]/g, '')
                                      .replace(/ /g, '-')
                                      .replace(/[^\w-]+/g, '');
                                "
                                v-model="editedItem.name"
                                :label="$t('post_category.name')"
                                :error-messages="errors"
                                required
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12">
                            <validation-provider
                              v-slot="{ errors }"
                              :name="$t('post_category.slug')"
                            >
                              <v-text-field
                                v-model="editedItem.slug"
                                :label="$t('post_category.slug')"
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
                      <v-btn
                        color="blue darken-1"
                        type="submit"
                        :disabled="invalid"
                        text
                      >
                        {{ $t("global.save") }}
                      </v-btn>
                    </v-card-actions>
                  </form>
                </validation-observer>
              </v-window-item>
            </v-window>
          </v-card>
        </v-scroll-y-transition>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import categoryAPI from "@/api/post-category";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "PostCategory",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      step: 1,
      active: [],
      categories: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        slug: "",
        parent_id: null,
      },
      defaultItem: {
        name: "",
        slug: "",
        parent_id: null,
      },
    };
  },

  computed: {
    selectedCategory() {
      if (!this.active.length) return undefined;
      return this.active[0];
    },

    addBtnTitle() {
      return this.selectedCategory
        ? this.$t("post_category.new_sub_item")
        : this.$t("post_category.new_item");
    },
  },

  async created() {
    await this.initialize();
  },

  watch: {
    active(value) {
      this.editedItem.parent_id = value[0]?.id;
      this.step = 1;
    },
  },

  methods: {
    async initialize() {
      try {
        this.fetchCategories();
      } catch (err) {
        console.log(err);
      }
    },
    async fetchCategories() {
      const res = await categoryAPI.list();
      this.categories = res.data.post_categories;
    },
    async save() {
      try {
        if (this.editedIndex > -1) {
          await categoryAPI.update(this.editedItem);
        } else {
          await categoryAPI.create(this.editedItem);
        }
        await this.fetchCategories();
        this.close();
      } catch (e) {
        console.error(e);
      }
    },
    close() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.$refs.observer.reset();
      });
    },
    createItem() {
      this.step++;
      this.editedItem = this.defaultItem;
    },
    editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.step++;
    },
  },
};
</script>
