import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

const DoubleHardWrapToParagraph = Extension.create({
  name: 'doubleHardWrapToParagraph',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('doubleHardWrapToParagraph'),
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === 'Enter') {
              const { state, dispatch } = view;
              const { selection } = state;
              const { $from } = selection;

              if (
                $from.nodeBefore &&
                $from.nodeBefore.type.name === 'hardBreak' &&
                $from.node(-1).content.content.length > 1 &&
                $from.node(-1).content.content[$from.node(-1).content.content.length - 2].type.name === 'hardBreak'
              ) {
                const tr = state.tr;
                const pos = $from.before();

                // Delete the two hard breaks
                tr.deleteRange(pos - 2, pos);

                // Insert a new paragraph
                const paragraphNode = this.editor.schema.nodes.paragraph.create();
                tr.insert(pos - 2, paragraphNode);

                dispatch(tr);
                return true; // Indicate that the event was handled
              }
            }
            return false;
          },
        },
      }),
    ];
  },
});

export default DoubleHardWrapToParagraph;
