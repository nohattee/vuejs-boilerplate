<template>
  <v-input class="editor" v-bind="$attrs">
    <v-card width="100%" v-if="editor">
      <v-toolbar flat>
        <v-btn
          v-for="(item, idx) in items"
          :color="item.isActive() ? 'primary' : ''"
          :key="idx"
          depressed
          text
          @click="item.action"
        >
          <v-icon>
            {{ item.icon }}
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <editor-content
          class="editor__content overflow-y-auto"
          :editor="editor"
        />
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
        {
          icon: "mdi-format-header-1",
          title: "Heading 1",
          action: () =>
            this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => this.editor.isActive("heading", { level: 1 }),
        },
        {
          icon: "mdi-format-header-2",
          title: "Heading 2",
          action: () =>
            this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => this.editor.isActive("heading", { level: 2 }),
        },
        {
          icon: "mdi-format-header-3",
          title: "Heading 3",
          action: () =>
            this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: () => this.editor.isActive("heading", { level: 3 }),
        },
        {
          icon: "mdi-format-list-bulleted",
          title: "Bullet List",
          action: () => this.editor.chain().focus().toggleBulletList().run(),
          isActive: () => this.editor.isActive("bulletList"),
        },
        {
          icon: "mdi-format-list-numbered",
          title: "Ordered List",
          action: () => this.editor.chain().focus().toggleOrderedList().run(),
          isActive: () => this.editor.isActive("orderedList"),
        },
        {
          icon: "mdi-xml",
          title: "Code",
          action: () => this.editor.chain().focus().toggleCodeBlock().run(),
          isActive: () => this.editor.isActive("codeBlock"),
        },
        {
          icon: "mdi-format-quote-open",
          title: "Blockquote",
          action: () => this.editor.chain().focus().toggleBlockquote().run(),
          isActive: () => this.editor.isActive("blockquote"),
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
      this.items.forEach((element) => {
        if (element.multiple) {
          element.value = [];
        }
        element.value = 1;
      });
      this.editor.commands.setContent(value, false);
    },
  },
  beforeUnmount() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
.editor .v-input__slot {
  flex-direction: column;
  grid-gap: 7px;
  align-items: flex-start;
}

.editor__content div {
  height: 400px;
}

/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  &:focus {
    outline: none;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  mark {
    background-color: #faf594;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  hr {
    margin: 1rem 0;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }

  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }
  }
}
</style>
