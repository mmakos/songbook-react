import { styled } from '@mui/material';
import { EditorContent } from '@tiptap/react';

const StyledEditorContent = styled(EditorContent, {
  shouldForwardProp: (prop) => prop !== 'showGrid',
})<{ showGrid?: boolean }>(({ showGrid, theme }) => ({
  '.tiptap': {
    borderRadius: theme.shape.borderRadius,
    outline: '1px solid white',
    outlineWidth: 1,
    outlineColor: theme.palette.action.disabled,
    padding: '0.5em',
    minHeight: '1em',
    minWidth: '20ch',
    ':hover': {
      outlineWidth: 2,
      outlineColor: theme.palette.text.primary,
    },
    ':focus': {
      outlineWidth: 2,
      outlineColor: theme.palette.primary.main,
    },
    p: {
      margin: 0,
    },
    '[data-indent="1"]': {
      paddingLeft: '3em',
    },
    '[data-indent="2"]': {
      paddingLeft: '5em',
    },
    '[data-indent="3"]': {
      paddingLeft: '7em',
    },
    '[data-indent="4"]': {
      paddingLeft: '9em',
    },

    table: {
      borderCollapse: 'collapse',
      'th, td': {
        padding: '0.5em 1em',
        border: showGrid ? '1px dashed gray' : undefined,
      },
      td: {
        verticalAlign: 'top',
      },
      'td:not(:first-of-type)': {
        fontWeight: 'bold',
        'u': {
          textDecoration: 'none'
        }
      },
      '.selectedCell': {
        background: 'gray',
      },
    },
  },
}));

export default StyledEditorContent;
