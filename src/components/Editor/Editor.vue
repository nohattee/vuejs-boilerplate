<template>
  <v-card>
    <v-toolbar flat>
      <v-btn-toggle
        v-model="toggle_multiple"
        color="primary"
        dense
        group
        multiple
      >
        <v-btn :value="1" text>
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>

        <v-btn :value="2" text>
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>

        <v-btn :value="3" text>
          <v-icon>mdi-format-underline</v-icon>
        </v-btn>

        <v-btn :value="4" text>
          <v-icon>mdi-format-color-fill</v-icon>
        </v-btn>
      </v-btn-toggle>

      <div class="mx-4"></div>

      <v-btn-toggle v-model="toggle_exclusive" color="primary" dense group>
        <v-btn :value="1" text>
          <v-icon>mdi-format-align-left</v-icon>
        </v-btn>

        <v-btn :value="2" text>
          <v-icon>mdi-format-align-center</v-icon>
        </v-btn>

        <v-btn :value="3" text>
          <v-icon>mdi-format-align-right</v-icon>
        </v-btn>

        <v-btn :value="4" text>
          <v-icon>mdi-format-align-justify</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card-text>
      <editor-content :editor="editor" />
    </v-card-text>
  </v-card>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";

export default {
  components: {
    EditorContent,
  },
  data() {
    return {
      editor: new Editor({
        content: `Type here...
        `,
        extensions: [StarterKit],
      }),
    };
  },
  methods: {
    loadImage: function (command) {
      command({
        src: "https://66.media.tumblr.com/dcd3d24b79d78a3ee0f9192246e727f1/tumblr_o00xgqMhPM1qak053o1_400.gif",
      });
    },
  },
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>
<style>
.editor-box > * {
  border-color: grey;
  border-style: solid;
  border-width: 1px;
}

.is-active {
  border-color: grey;
  border-style: solid;
  border-width: 1px;
}
/* *:focus {
    outline: none;
}  */
</style>
