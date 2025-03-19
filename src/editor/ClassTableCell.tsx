import {TableCell} from "@tiptap/extension-table-cell";

const ClassTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      cellType: {
        default: null,
        parseHTML: (element) => element.getAttribute('cell-type') || null,
        renderHTML: (attributes) => {
          return attributes.cellType !== null ? {"cell-type": attributes.cellType} : {};
        }
      }
    }
  },
});

export default ClassTableCell;