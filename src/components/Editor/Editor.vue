<template>
  <v-card>
    <v-toolbar flat>
      <v-btn-toggle color="primary" dense group multiple>
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

      <v-btn-toggle color="primary" dense group>
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
      editor: null,
    };
  },
  mounted() {
    this.editor = new Editor({
      extensions: [StarterKit],
      content: this.modelValue,
      onUpdate: () => {
        // HTML
        // this.$emit("update:modelValue", this.editor.getHTML());
        this.$emit("input", this.editor.getHTML());

        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
    });
  },
  watch: {
    modelValue(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;

      // JSON
      // const isSame = this.editor.getJSON().toString() === value.toString()

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(value, false);
    },
  },
  beforeUnmount() {
    this.editor.destroy();
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
};
</script>
