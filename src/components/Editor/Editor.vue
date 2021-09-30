<template>
  <v-input class="editor" v-bind="$attrs">
    <v-card width="100%">
      <v-toolbar flat>
        <v-btn-toggle
          v-model="toggle_multiple"
          color="primary"
          dense
          group
          multiple
        >
          <template v-for="(item, index) in items">
            <v-btn :key="index" :value="index" text @click="item.action">
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-btn>
          </template>
        </v-btn-toggle>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <editor-content :editor="editor" />
      </v-card-text>
    </v-card>
  </v-input>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

export default {
  components: {
    EditorContent,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      toggle_multiple: [],
      editor: null,
      items: [
        {
          icon: "mdi-format-bold",
          title: "Bold",
          action: () => this.editor.chain().focus().toggleBold().run(),
          isActive: () => this.editor.isActive("bold"),
        },
        {
          icon: "mdi-format-italic",
          title: "Italic",
          action: () => this.editor.chain().focus().toggleItalic().run(),
          isActive: () => this.editor.isActive("italic"),
        },
        {
          icon: "mdi-format-underline",
          title: "Underline",
          action: () => this.editor.chain().focus().toggleUnderline().run(),
          isActive: () => this.editor.isActive("underline"),
        },
        {
          icon: "mdi-format-align-left",
          title: "Left",
          action: () => this.editor.chain().focus().setTextAlign("left").run(),
          isActive: () => this.editor.isActive({ textAlign: "left" }),
        },
        {
          icon: "mdi-format-align-center",
          title: "Center",
          action: () =>
            this.editor.chain().focus().setTextAlign("center").run(),
          isActive: () => this.editor.isActive({ textAlign: "center" }),
        },
        {
          icon: "mdi-format-align-justify",
          title: "Justify",
          action: () =>
            this.editor.chain().focus().setTextAlign("justify").run(),
          isActive: () => this.editor.isActive({ textAlign: "justify" }),
        },
      ],
    };
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ],
      content: this.value,
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
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;

      // JSON
      // const isSame = this.editor.getJSON().toString() === value.toString()

      if (isSame) {
        return;
      }
      this.toggle_multiple = [];
      this.editor.commands.setContent(value, false);
    },
  },
  beforeUnmount() {
    console.log("asd");
    this.editor.destroy();
  },
};
</script>

<style>
.editor .v-input__slot {
  flex-direction: column;
  grid-gap: 7px;
  align-items: flex-start;
}
</style>
