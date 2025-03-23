import { Bold } from '@tiptap/extension-bold';
import { Underline } from '@tiptap/extension-underline';
import { Italic } from '@tiptap/extension-italic';
import { getMarkType, isMarkActive } from '@tiptap/core';
import { CellSelection, isInTable } from '@tiptap/pm/tables';
import { EditorState } from '@tiptap/pm/state';
import { CommandProps } from '@tiptap/react';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';
import { Strike } from '@tiptap/extension-strike';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    exclusiveItalic: {
      toggleItalic: (...types: string[]) => ReturnType;
    };
    exclusiveUnderline: {
      toggleUnderline: (...types: string[]) => ReturnType;
    };
    exclusiveBold: {
      toggleBold: (...types: string[]) => ReturnType;
    };
  }
}

const onlyCellsOfTypeSelected = (state: EditorState, ...types: string[]) => {
  if (!types.length) return true;
  if (!isInTable(state)) return false;
  const selection = state.selection;
  let cellsOfType = true;
  if (selection instanceof CellSelection) {
    selection.forEachCell((cell) => {
      if (!types.includes(cell.attrs.cellType)) cellsOfType = false;
    });
  } else {
    const { $from, $to } = selection;
    state.doc.nodesBetween($from.pos, $to.pos, (node) => {
      if (node.type.name === 'tableHeader' || node.type.name === 'tableCell') {
        if (!types.includes(node.attrs.cellType)) cellsOfType = false;
        return false;
      }
    });
  }
  return cellsOfType;
};

const setExclusive = ({ commands, state }: CommandProps, mark: string, ...otherMarks: string[]) => {
  const type = getMarkType(mark, state.schema);
  const isActive = isMarkActive(state, type);
  if (!isActive) {
    otherMarks.forEach((mark) => commands.unsetMark(mark));
    return commands.setMark(mark);
  }
  return commands.unsetMark(mark);
};

export const ExclusiveItalic = Italic.extend({
  name: 'exclusiveItalic',

  addCommands() {
    return {
      ...this.parent?.(),
      toggleItalic:
        (...types: string[]) =>
        (props) => {
          if (!onlyCellsOfTypeSelected(props.state, ...types)) return false;
          return setExclusive(props, 'exclusiveItalic', 'exclusiveBold', 'exclusiveUnderline');
        },
    };
  },
});

export const ExclusiveUnderline = Underline.extend({
  name: 'exclusiveUnderline',

  addCommands() {
    return {
      ...this.parent?.(),
      toggleUnderline:
        (...types: string[]) =>
        (props) => {
          if (!onlyCellsOfTypeSelected(props.state, ...types)) return false;
          return setExclusive(props, 'exclusiveUnderline', 'exclusiveItalic', 'exclusiveBold');
        },
    };
  },
});

export const ExclusiveBold = Bold.extend({
  name: 'exclusiveBold',

  addCommands() {
    return {
      ...this.parent?.(),

      toggleBold:
        (...types: string[]) =>
        (props) => {
          if (!onlyCellsOfTypeSelected(props.state, ...types)) return false;
          return setExclusive(props, 'exclusiveBold', 'exclusiveItalic', 'exclusiveUnderline');
        },
    };
  },
});

export const ChordSuperscript = Superscript.extend({
  name: 'chordSuperscript',

  addCommands() {
    return {
      ...this.parent?.(),

      toggleSuperscript:
        () =>
        ({ commands, state }) => {
          if (!onlyCellsOfTypeSelected(state, 'chord')) return false;
          return commands.toggleMark('chordSuperscript');
        },
    };
  },
});

export const ChordSubscript = Subscript.extend({
  name: 'chordSubscript',

  addCommands() {
    return {
      ...this.parent?.(),

      toggleSubscript:
        () =>
        ({ commands, state }) => {
          if (!onlyCellsOfTypeSelected(state, 'chord')) return false;
          return commands.toggleMark('chordSubscript');
        },
    };
  },
});

export const ChordStrike = Strike.extend({
  name: 'chordStrike',

  addCommands() {
    return {
      ...this.parent?.(),

      toggleStrike:
        () =>
        ({ commands, state }) => {
          if (!onlyCellsOfTypeSelected(state, 'chord')) return false;
          return commands.toggleMark('chordStrike');
        },
    };
  },

  addInputRules() {
    return [];
  },

  addPasteRules() {
    return [];
  },
});
