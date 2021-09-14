<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on"> Open Dialog </v-btn>
    </template>
    <v-card>
      <v-toolbar color="primary" dark>{{ $t("global.media") }}</v-toolbar>
      <v-tabs color="deep-purple accent-4">
        <v-tab>{{ $t("media.upload") }}</v-tab>
        <v-tab>{{ $t("media.gallery") }}</v-tab>

        <v-tab-item>
          <v-card-actions class="justify-center">
            <v-btn> {{ $t("media.select_files") }} </v-btn>
          </v-card-actions>
        </v-tab-item>

        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col v-for="i in 6" :key="i" cols="12" md="4">
                <v-img
                  :src="`https://picsum.photos/500/300?image=${i * 2 * 5 + 10}`"
                  :lazy-src="`https://picsum.photos/10/6?image=${
                    i * n * 5 + 10
                  }`"
                  aspect-ratio="1"
                ></v-img>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Media",
};
</script>
