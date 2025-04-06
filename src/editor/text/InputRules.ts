import { Extension, textInputRule } from '@tiptap/core';
import { InputRule } from '@tiptap/react';

const intervalInputRule = () =>
  new InputRule({
    find: /(?:^|\s|\/)[A-Ha-h](?:is|e?s|[#b<>+])?(\d)$/,
    handler: ({ state, range, match }) => {
      const { tr } = state;
      const char = match[1];
      const interval = +char;
      tr.insertText(char);
      const end = range.from + match[0].length;
      const start = end - 1;
      if (interval === 1) {
        tr.addMark(start, end, state.schema.marks.chordStrike.create());
        tr.addMark(start, end, state.schema.marks.chordSubscript.create());
        tr.removeStoredMark(state.schema.marks.chordStrike);
      } else if (interval === 3 || interval === 5) {
        tr.addMark(start, end, state.schema.marks.chordSubscript.create());
      } else {
        tr.addMark(start, end, state.schema.marks.chordSuperscript.create());
      }
    },
  });

const endIntervalInputRule = () =>
  new InputRule({
    find: /(^|[\d)<>+])(.)$/,
    handler: ({ state, range, match }) => {
      const { tr } = state;
      const char = match[2];
      const prep = match[1];
      const start = range.from + prep.length;
      const end = start + 1;
      if (prep.length === 0 || char === ' ' || char === '/') {
        // Nowa linia
        tr.insertText(char);
        tr.removeMark(start, end + 1);
      } else if (RegExp(/[A-Ha-h(]/).exec(char) || prep.length === 0) {
        // Nowy akord
        tr.insertText(' ' + char);
        tr.removeMark(start, end + 1);
      } else if (RegExp(/\d/).exec(char)) {
        // dodatkowy składnik
        tr.insertText(char);
        tr.removeMark(start, end + 1);
        tr.addMark(start, end, state.schema.marks.chordSuperscript.create());
      }
    },
  });

const InputRules = Extension.create({
  name: 'textReplacer',

  addInputRules() {
    return [textInputRule({ find: /\.\.\.$/, replace: '…' }), intervalInputRule(), endIntervalInputRule()];
  },
});

export default InputRules;
