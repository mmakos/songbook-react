import { styled } from '@mui/material';
import { EditorContent } from '@tiptap/react';

const StyledEditorContent = styled(EditorContent)(({ theme }) => ({
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
      ':first-child': {
        marginTop: 0,
      },
      ':last-child': {
        marginBottom: 0,
      },
    },
    '[data-indent="1"]': {
      marginLeft: '4ch',
    },
    '[data-indent="2"]': {
      marginLeft: '8ch',
    },
    '[data-indent="3"]': {
      marginLeft: '12ch',
    },
    '[data-indent="4"]': {
      marginLeft: '16ch',
    },
  },
}));

export default StyledEditorContent;
