import { styled } from '@mui/material';
import { EditorContent } from '@tiptap/react';

const StyledEditorContent = styled(EditorContent, {
  shouldForwardProp: (prop) => prop !== 'showGrid',
})<{ showGrid?: boolean }>(({ showGrid, theme }) => ({
  width: '100%',
  '.tiptap': {
    borderRadius: theme.shape.borderRadius,
    outline: '1px solid white',
    outlineWidth: 1,
    outlineColor: theme.palette.action.disabled,
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
      width: '100%',
      borderCollapse: 'collapse',
      'th, td': {
        padding: '0.5em 1em',
        position: 'relative',
      },
      th: {
        borderBottom: '1px solid',
      },
      td: {
        verticalAlign: 'top',
        border: showGrid ? '1px dashed gray' : undefined,
        '&[cell-type="chord"], &[cell-type="repetition"]': {
          fontWeight: 'bold',
          u: {
            textDecoration: 'none',
          },
        },
        '&[cell-type="comment"]': {
          fontStyle: 'italic',
          strong: {
            fontWeight: 'normal',
          },
          u: {
            textDecoration: 'none',
          },
        },
      },
      'tr:first-of-type th': {
        borderTop: 'none',
      },
      'tr:last-of-type td': {
        borderBottom: 'none',
      },
      'tr td:first-of-type,th:first-of-type': {
        borderLeft: 'none',
      },
      'tr td:last-of-type,th:last-of-type': {
        borderRight: 'none',
      },
      '.selectedCell': {
        background: 'gray',
      },
      '.column-resize-handle': {
        backgroundColor: theme.palette.primary.main,
        bottom: 0,
        pointerEvents: 'none',
        position: 'absolute',
        right: '-1px',
        top: 0,
        width: '2px',
      },
    },
    '&.resize-cursor': {
      cursor: 'col-resize',
    },
  },
}));

export default StyledEditorContent;
