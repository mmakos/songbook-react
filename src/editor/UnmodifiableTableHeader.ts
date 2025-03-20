import { TableHeader } from '@tiptap/extension-table-header';

const UnmodifiableTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      contenteditable: {
        default: false,
        parseHTML: () => false,
        renderHTML: () => ({ contenteditable: 'false' }),
      },
    };
  },
});

export default UnmodifiableTableHeader;
