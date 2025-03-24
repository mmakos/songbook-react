import { Table } from '@tiptap/extension-table';
import { Command } from '@tiptap/core';
import { EditorState, TextSelection, Transaction } from '@tiptap/pm/state';
import { Attrs, Node, NodeType } from '@tiptap/pm/model';
import {
  deleteRow,
  isInTable,
  nextCell,
  removeColumn,
  selectedRect,
  selectionCell,
  tableNodeTypes,
  TableRect,
} from '@tiptap/pm/tables';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    songTable: {
      goToNextRow: () => ReturnType;
      addColumn: (position: number, title: string, attrs?: Attrs, mergeHeader?: boolean) => ReturnType;
      removeColumn: (position: number) => ReturnType;
    };
  }
}

const addColumn = (
  { tr, schema }: EditorState,
  { map, tableStart, table }: TableRect,
  col: number,
  title: string,
  attrs?: Attrs,
  mergeHeader?: boolean
) => {
  const refColumn = col > 0 ? -1 : 0;
  for (let row = 0; row < map.height; row++) {
    const index = row * map.width + col;
    const node: Node = table.nodeAt(map.map[index + refColumn])!;
    const type: NodeType = node.type;
    const isHeader = type.name === 'tableHeader';
    if (isHeader && mergeHeader) {
      const pos = map.positionAt(row, col - 1, table);
      tr.setNodeMarkup(tr.mapping.map(tableStart + pos), null, {
        ...node.attrs,
        colspan: (node.attrs.colspan || 1) + 1,
      });
    } else {
      const pos = map.positionAt(row, col, table);
      tr.insert(
        tr.mapping.map(tableStart + pos),
        isHeader
          ? type.create(null, schema.nodes.paragraph.create(null, schema.text(title)))!
          : type.createAndFill({ ...attrs })!
      );
    }
  }
  return tr;
};

const addRow = (tr: Transaction, { map, tableStart, table }: TableRect, row: number) => {
  let rowPos = tableStart;
  for (let i = 0; i < row; i++) {
    rowPos += table.child(i).nodeSize;
  }
  const cells = [];
  const refRow = row > 1 ? -1 : 0;
  for (let col = 0, index = map.width * row; col < map.width; col++, index++) {
    const refCell = table.nodeAt(map.map[index + refRow * map.width])!;
    const newCell = refCell.type.createAndFill(refCell.attrs)!;
    cells.push(newCell);
  }
  tr.insert(rowPos, tableNodeTypes(table.type.schema).row.create(null, cells));
  return tr;
};

const SongTable = Table.extend({
  name: 'songTable',

  addCommands() {
    return {
      ...this.parent?.(),

      goToNextRow:
        (): Command =>
        ({ state, dispatch }) => {
          if (!isInTable(state)) return false;
          const currentCell = selectionCell(state);
          const cellBelow = nextCell(currentCell, 'vert', 1);
          if (cellBelow == null) return false;

          dispatch?.(state.tr.setSelection(TextSelection.near(cellBelow)));
          return true;
        },

      addRowAfter:
        (): Command =>
        ({ state, dispatch }) => {
          if (!isInTable(state)) return false;
          const rect = selectedRect(state);
          if (dispatch) {
            dispatch(addRow(state.tr, rect, rect.bottom));
          }
          return true;
        },

      deleteRow:
        (): Command =>
        ({ state, dispatch }) => {
          if (!isInTable(state)) return false;
          const rect = selectedRect(state);
          if (rect.top == 0 || rect.table.childCount <= 2) return false;

          dispatch && deleteRow(state, dispatch);
          return true;
        },

      addColumn:
        (position: number, title: string, attrs?: Attrs, mergeHeader?: boolean): Command =>
        ({ state, dispatch }) => {
          if (!isInTable(state)) return false;
          if (dispatch) {
            const rect = selectedRect(state);
            if (position < 0) {
              position = rect.map.width + position + 1;
            }

            dispatch(addColumn(state, rect, position, title, attrs, mergeHeader));
          }
          return true;
        },

      removeColumn:
        (position: number): Command =>
        ({ state, dispatch }) => {
          if (!isInTable(state)) return false;
          if (dispatch) {
            const rect = selectedRect(state);
            if (position < 0) {
              position = rect.map.width + position;
            }

            dispatch(removeColumn(state.tr, rect, position));
          }
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
