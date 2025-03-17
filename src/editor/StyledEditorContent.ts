import { styled } from '@mui/material';
import { EditorContent } from '@tiptap/react';

const StyledEditorContent = styled(EditorContent)(({ theme }) => ({
  '.tiptap': {
    borderWidth: 1,
    borderRadius: theme.shape.borderRadius,
    borderStyle: 'solid',
    borderColor: theme.palette.action.disabled,
    outline: 'none',
    padding: '0.5em',
    minHeight: '1em',
    minWidth: '20ch',
    ':hover': {
      borderWidth: 2,
      borderColor: theme.palette.text.primary,
    },
    ':focus': {
      borderWidth: 2,
      borderColor: theme.palette.primary.main,
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
