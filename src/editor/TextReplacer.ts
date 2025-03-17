import { Extension, textInputRule } from '@tiptap/core';

const TextReplacer = Extension.create({
  name: 'textReplacer',

  addInputRules() {
    return [textInputRule({ find: /\.\.\.$/, replace: '…' })];
  },
});

export default TextReplacer;
