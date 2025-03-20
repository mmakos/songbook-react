import { Table } from '@tiptap/extension-table';
import { Command } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import { addColumn, isInTable, nextCell, selectedRect, selectionCell } from '@tiptap/pm/tables';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    songTable: {
      goToNextRow: () => ReturnType;
      addChordsColumn: () => ReturnType;
      removeChordsColumn: () => ReturnType;
    };
  }
}

const SongTable = Table.extend({
  name: 'songTable',

  addCommands() {
    return {
      ...this.parent?.(),

      goToNextRow:
        (): Command =>
        ({ state, dispatch }) => {
          if (!dispatch || !isInTable(state)) return false;
          const currentCell = selectionCell(state);
          const cellBelow = nextCell(currentCell, 'vert', 1);
          if (cellBelow == null) return false;

          dispatch(state.tr.setSelection(TextSelection.near(cellBelow)));
          return true;
        },

      addChordsColumn:
        (): Command =>
        ({ state, dispatch }) => {
          if (!isInTable(state) || !dispatch) return false;
          const rect = selectedRect(state);

          return dispatch(addColumn(state.tr, rect, rect.map.width));
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Delete': () => this.editor.commands.deleteRow(),
      'Mod-Enter': () => this.editor.chain().addRowAfter().goToNextRow().run(),
      'Shift-Enter': () => this.editor.chain().addRowAfter().goToNextRow().run(),
    };
  },
});

export default SongTable;
