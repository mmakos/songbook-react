import { Table } from '@tiptap/extension-table';
import { Command } from '@tiptap/core';
import { EditorState, TextSelection } from '@tiptap/pm/state';
import { Attrs, NodeType } from '@tiptap/pm/model';
import {
  addColSpan,
  isInTable,
  nextCell,
  removeColumn,
  selectedRect,
  selectionCell,
  TableRect,
} from '@tiptap/pm/tables';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    songTable: {
      goToNextRow: () => ReturnType;
      addChordsColumn: () => ReturnType;
      removeChordsColumn: () => ReturnType;
      addRepetitionColumn: () => ReturnType;
      removeRepetitionColumn: () => ReturnType;
    };
  }
}

interface CellAttrs {
  colspan: number;
  rowspan: number;
  colwidth: number[] | null;
}

function addColumn(
  { tr, schema }: EditorState,
  { map, tableStart, table }: TableRect,
  col: number,
  title: string,
  attrs?: Attrs
) {
  const refColumn = col > 0 ? -1 : 0;
  for (let row = 0; row < map.height; row++) {
    const index = row * map.width + col;
    if (col > 0 && col < map.width && map.map[index - 1] == map.map[index]) {
      const pos = map.map[index];
      const cell = table.nodeAt(pos);
      const cellAttrs = cell!.attrs as CellAttrs;
      tr.setNodeMarkup(tr.mapping.map(tableStart + pos), null, addColSpan(cellAttrs, col - map.colCount(pos)));
      row += cellAttrs.rowspan - 1;
    } else {
      const type: NodeType = table.nodeAt(map.map[index + refColumn])!.type;
      console.log(type);
      const pos = map.positionAt(row, col, table);
      tr.insert(
        tr.mapping.map(tableStart + pos),
        row === 0
          ? type.create(null, schema.nodes.paragraph.create(null, schema.text(title)))!
          : type.createAndFill(attrs)!
      );
    }
  }
  return tr;
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
          const position = rect.map.width;

          dispatch(addColumn(state, rect, position, 'Alter.', { cellType: 'chord' }));
          return true;
        },

      removeChordsColumn:
        (): Command =>
        ({ state, dispatch }) => {
          if (!isInTable(state) || !dispatch) return false;
          const rect = selectedRect(state);

          dispatch(removeColumn(state.tr, rect, rect.map.width - 1));
          return true;
        },

      addRepetitionColumn:
        (): Command =>
        ({ state, dispatch }) => {
          if (!isInTable(state) || !dispatch) return false;
          const rect = selectedRect(state);

          dispatch(addColumn(state, rect, 1, 'Rep.'));
          return true;
        },

      removeRepetitionColumn:
        (): Command =>
        ({ state, dispatch }) => {
          if (!isInTable(state) || !dispatch) return false;
          const rect = selectedRect(state);

          dispatch(removeColumn(state.tr, rect, 1));
          return true;
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
