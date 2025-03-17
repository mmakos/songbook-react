import { Extension } from "@tiptap/core";

const AutoParagraph = Extension.create({
  name: "autoParagraph",

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor, event }) => {
        const { state, dispatch } = editor.view;
        const { selection } = state;
        const pos = selection.from;
        const beforeText = state.doc.textBetween(Math.max(0, pos - 2), pos, "\n", "\n");

        if (beforeText === "\n\n") {
          event.preventDefault();
          editor.chain().focus().setParagraph().run();
          return true;
        }

        return false;
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      {
        props: {
          handlePaste(view, event) {
            event.preventDefault();
            const text = event.clipboardData.getData("text/plain");

            // Convert `\n\n` to separate paragraphs
            const formattedText = text
                .split("\n\n")
                .map((line) => `<p>${line}</p>`)
                .join("");

            view.dispatch(view.state.tr.insertText(formattedText));
            return true;
          },
        },
      },
    ];
  },
});

export default AutoParagraph;
