import {Bold} from "@tiptap/extension-bold";
import {Underline} from "@tiptap/extension-underline";
import {Italic} from "@tiptap/extension-italic";

export const ExclusiveItalic = Italic.extend({
  addCommands() {
    return {
      setUnderline:
          () =>
              ({ commands }) => {
                commands.unsetMark('underline');
                commands.unsetMark('bold');
                return commands.setMark('italic');
              },
    };
  },
});

export const ExclusiveUnderline = Underline.extend({
  addCommands() {
    return {
      setUnderline:
          () =>
              ({ commands }) => {
                commands.unsetMark('italic');
                commands.unsetMark('bold');
                return commands.setMark('underline');
              },
    };
  },
});

export const ExclusiveBold = Bold.extend({
  addCommands() {
    return {
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
