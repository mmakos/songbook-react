import { Command, Extension } from '@tiptap/core';
import { CellSelection } from '@tiptap/pm/tables';
import { TextSelection, Transaction } from '@tiptap/pm/state';

export interface IndentOptions {
  minLevel: number;
  maxLevel: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

const Indent = Extension.create<IndentOptions>({
  name: 'indent',

  addOptions() {
    return {
      minLevel: 0,
      maxLevel: 3,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ['tableCell'],
        attributes: {
          indent: {
            renderHTML: (attributes) => {
              return attributes?.indent > this.options.minLevel ? { 'data-indent': attributes.indent } : null;
            },
            parseHTML: (element) => {
              const level = Number(element.getAttribute('data-indent'));
              return level && level > this.options.minLevel ? level : null;
            },
          },
        },
      },
    ];
  },

  addCommands() {
    const setNodeIndentMarkup = (tr: Transaction, pos: number, delta: number): Transaction => {
      const node = tr?.doc?.nodeAt(pos);

      if (node) {
        const nextLevel = (node.attrs.indent || 0) + delta;
        const { minLevel, maxLevel } = this.options;
        const indent = nextLevel < minLevel ? minLevel : nextLevel > maxLevel ? maxLevel : nextLevel;

        if (indent !== node.attrs.indent) {
          const { indent: oldIndent, ...currentAttrs } = node.attrs;
          const nodeAttrs = indent > minLevel ? { ...currentAttrs, indent } : currentAttrs;
          return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
        }
      }
      return tr;
    };

    const updateIndentLevel = (tr: Transaction, delta: number): Transaction => {
      const { doc, selection } = tr;

      if (doc && selection) {
        if (selection instanceof CellSelection) {
          selection.forEachCell((cell, pos) => {
            if (cell.attrs.cellType === 'text') {
              tr = setNodeIndentMarkup(tr, pos, delta);
            }
          });
        } else if (selection instanceof TextSelection) {
          const { from, to } = selection;
          doc.nodesBetween(from, to, (node, pos) => {
            if (node.type.name === 'tableCell' && node.attrs.cellType === 'text') {
              tr = setNodeIndentMarkup(tr, pos, delta);
              return false;
            }

            return true;
          });
        }
      }

      return tr;
    };
    const applyIndent: (direction: number) => () => Command =
      (direction) =>
      () =>
      ({ tr, state, dispatch }) => {
        const { selection } = state;
        tr = tr.setSelection(selection);
        tr = updateIndentLevel(tr, direction);

        if (tr.docChanged) {
          dispatch?.(tr);
          return true;
        }

        return false;
      };

    return {
      indent: applyIndent(1),
      outdent: applyIndent(-1),
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.indent();
      },
      'Shift-Tab': () => {
        return this.editor.commands.outdent();
      },
    };
  },
});

export default Indent;
