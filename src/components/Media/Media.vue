<template>
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on">
        {{ $t("media.open") }}
      </v-btn>
    </template>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>{{ $t("global.media") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false">
            {{ $t("global.cancel") }}
          </v-btn>
          <v-btn dark text v-if="selectedFile" @click="selectFile()">
            {{ $t("global.choose") }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-tabs v-model="tab" color="deep-purple accent-4">
        <v-tab href="#upload">{{ $t("media.upload") }}</v-tab>
        <v-tab href="#gallery">{{ $t("media.gallery") }}</v-tab>

        <v-tab-item value="upload">
          <v-sheet
            class="d-flex justify-center ma-6"
            :rounded="true"
            color="grey lighten-3"
            height="300"
          >
            <div class="my-auto text-center f-12">
              <p class="text-h2">{{ $t("media.drop_files_here") }}</p>
              <p>{{ $t("global.or") }}</p>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="loadingUpload"
                :loading="loadingUpload"
                @click="$refs.uploader.$refs.input.click()"
              >
                {{ $t("media.select_files") }}
              </v-btn>
              <v-file-input
                ref="uploader"
                multiple
                class="d-none"
                @change="onUploaderChange"
              ></v-file-input>
            </div>
          </v-sheet>
        </v-tab-item>

        <v-tab-item value="gallery">
          <v-sheet
            class="d-flex justify-center ma-6 overflow-y-auto"
            :rounded="true"
            color="grey lighten-3"
            height="300"
          >
            <v-container fluid>
              <v-row v-if="files.length != 0">
                <v-col v-for="file in files" :key="file.name" cols="3">
                  <v-card
                    :style="
                      selectedFile == file
                        ? 'border: 5px solid #4CAF50;'
                        : 'border: 5px solid white;'
                    "
                  >
                    <v-img
                      @click="selectedFile = file"
                      :src="file.url"
                      :lazy-src="`https://picsum.photos/10/6?image=${
                        1 * 1 * 5 + 10
                      }`"
                    />
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script>
import fileAPI from "@/api/file";
export default {
  name: "Media",
  data() {
    return {
      tab: "gallery",
      dialog: false,
      selectedFile: null,
      loadingUpload: false,
      files: [],
    };
  },
  async created() {
    await this.initialize();
  },
  methods: {
    async initialize() {
      const res = await fileAPI.list();
      this.files = res.data.data.files;
    },
    async onUploaderChange(files) {
      this.loadingUpload = true;
      await fileAPI.upload(files);
      await this.initialize();
      this.tab = "gallery";
      this.loadingUpload = false;
    },
    selectFile() {
      this.dialog = false;
      this.$emit("input", this.selectedFile);
    },
  },
  props: {
    modelValue: {
      type: Object,
      default: null,
    },
  },
};
</script>
