import { Plugin } from '@tiptap/pm/state';
import { Extension } from '@tiptap/core';

const PreventCellDrag = Extension.create({
  name: 'preventCellDrag',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            dragstart(_, event) {
              event.preventDefault();
              return true;
            },
          },
        },
      }),
    ];
  },
});

export default PreventCellDrag;
