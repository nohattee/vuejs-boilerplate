<template>
  <v-data-table
    :headers="headers"
    :items="posts"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ $t("global.post") }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              {{ $t("post.new_item") }}
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
                          :name="$t('post.title')"
                          rules="required"
                        >
                          <v-text-field
                            @change="
                              if (editedItem.slug === '')
                                editedItem.slug = editedItem.title
                                  .toLowerCase()
                                  .normalize('NFD')
                                  .replace(/đ/g, 'd')
                                  .replace(/[\u0300-\u036f]/g, '')
                                  .replace(/ /g, '-')
                                  .replace(/[^\w-]+/g, '');
                            "
                            v-model="editedItem.title"
                            :label="$t('post.title')"
                            :error-messages="errors"
                            required
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12">
                        <validation-provider
                          v-slot="{ errors }"
                          :name="$t('post.slug')"
                        >
                          <v-text-field
                            v-model="editedItem.slug"
                            :label="$t('post.slug')"
                            :error-messages="errors"
                            required
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12">
                        <v-label>{{ $t("post.thumbnail") }}</v-label>
                        <v-input>
                          <media v-model="image" />
                        </v-input>
                        <v-img
                          :src="editedItem.thumbnail"
                          lazy-src="https://picsum.photos/id/11/10/6"
                          max-height="150"
                          max-width="250"
                          aspect-ratio="1"
                        />
                      </v-col>
                      <v-col cols="12">
                        <validation-provider
                          v-slot="{ errors }"
                          :name="$t('post.content')"
                          rules="required|min:200"
                        >
                          <editor
                            :label="$t('post.content')"
                            v-model="editedItem.content"
                            :error-messages="errors"
                            required
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="dialogCloseItemConfirm = true"
                  >
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
        <v-dialog v-model="dialogCloseItemConfirm" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to close this post?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialogCloseItemConfirm = false"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="close">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.thumbnail="{ item }">
      <v-img max-height="100" max-width="200" :src="item.thumbnail"></v-img>
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
import postAPI from "@/api/post";
import categoryAPI from "@/api/post-category";
import Editor from "@/components/Editor";
import Media from "@/components/Media";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "Post",
  components: {
    ValidationProvider,
    ValidationObserver,
    Editor,
    Media,
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      dialogCloseItemConfirm: false,
      posts: [],
      categories: [],
      editedIndex: -1,
      editedItem: {
        post_id: "",
        title: "",
        content: "Writing something...",
        slug: "",
        post_status: "private",
        thumbnail: "https://picsum.photos/id/11/10/6",
        author_id: 1,
        post_categories: [],
      },
      defaultItem: {
        post_id: "",
        title: "",
        content: "Writing something...",
        slug: "",
        post_status: "private",
        thumbnail: "https://picsum.photos/id/11/10/6",
        author_id: 1,
        post_categories: [],
      },
      image: null,
    };
  },

  computed: {
    headers() {
      return [
        {
          text: this.$t("post.post_id"),
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: this.$t("post.title"), value: "title" },
        { text: this.$t("post.thumbnail"), value: "thumbnail" },
        { text: this.$t("post.post_status"), value: "post_status" },
        { text: this.$t("global.actions"), value: "actions", sortable: false },
      ];
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("post.new_item")
        : this.$t("post.edit_item");
    },
  },

  watch: {
    image(value) {
      this.editedItem.thumbnail = value.url;
    },
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
        this.fetchPosts();
        this.fetchCategories();
      } catch (err) {
        console.log(err);
      }
    },
    async fetchPosts() {
      const res = await postAPI.list();
      this.posts = res.data.posts;
    },
    async fetchCategories() {
      const res = await categoryAPI.list();
      this.categories = res.data.post_categories;
    },
    editItem(item) {
      this.editedIndex = this.posts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.posts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.posts.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialogCloseItemConfirm = false;
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

    async save() {
      try {
        if (this.editedIndex > -1) {
          await postAPI.update(this.editedItem);
          Object.assign(this.posts[this.editedIndex], this.editedItem);
        } else {
          await postAPI.create(this.editedItem);
          this.posts.push(this.editedItem);
        }
      } catch (e) {
        console.error(e);
      }
      this.close();
    },
  },
};
</script>
