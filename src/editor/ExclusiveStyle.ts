import { Bold } from '@tiptap/extension-bold';
import { Underline } from '@tiptap/extension-underline';
import { Italic } from '@tiptap/extension-italic';
import { getMarkType, isMarkActive } from '@tiptap/core';

export const ExclusiveItalic = Italic.extend({
  addCommands() {
    return {
      ...this.parent?.(),
      toggleItalic:
        () =>
        ({ commands, state }) => {
          const type = getMarkType('italic', state.schema);
          const isActive = isMarkActive(state, type);
          if (!isActive) {
            commands.unsetMark('underline');
            commands.unsetMark('bold');
            return commands.setMark('italic');
          }
          return commands.unsetMark('italic');
        },
    };
  },
});

export const ExclusiveUnderline = Underline.extend({
  addCommands() {
    return {
      ...this.parent?.(),
      toggleUnderline:
        () =>
        ({ commands, state }) => {
          const type = getMarkType('underline', state.schema);
          const isActive = isMarkActive(state, type);
          if (!isActive) {
            commands.unsetMark('italic');
            commands.unsetMark('bold');
            return commands.setMark('underline');
          }
          return commands.unsetMark('underline');
        },
    };
  },
});

export const ExclusiveBold = Bold.extend({
  addCommands() {
    return {
      ...this.parent?.(),

      toggleBold:
        () =>
        ({ commands, state }) => {
          const type = getMarkType('bold', state.schema);
          const isActive = isMarkActive(state, type);
          if (!isActive) {
            commands.unsetMark('italic');
            commands.unsetMark('underline');
            return commands.setMark('bold');
          }
          return commands.unsetMark('bold');
        },

      setBold:
        () =>
        ({ commands }) => {
          commands.unsetMark('italic');
          commands.unsetMark('underline');
          return commands.setMark('bold');
        },
    };
  },
});
