import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { DOMParser } from '@tiptap/pm/model';

const SongTablePaste = Extension.create({
  name: 'songTablePaste',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          clipboardTextParser(text, $context, _, view) {
            console.log(text);
            const stanzas = text
              ?.split(/\n\s*\n/)
              .map((s) => s.trim())
              .filter(Boolean);
            const tableHtml = stanzas
              .map(
                (stanza) =>
                  `<tr><td colspan="1" rowspan="1" cell-type="text"><p>${stanza.replace(/\n/g, '</p><p>')}</p></td></tr>`
              )
              .join('');
            const fullHTML = `<table data-pm-slice="1 1 -2 []"><tbody>${tableHtml}</tbody></table>`;
            const element = document.createElement('div');
            element.innerHTML = fullHTML;
            const parser = DOMParser.fromSchema(view.state.schema);

            return parser.parseSlice(element, { context: $context });
          },
        },
      }),
    ];
  },
});

export default SongTablePaste;
