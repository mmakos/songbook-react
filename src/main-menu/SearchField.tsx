import { styled, TextField } from '@mui/material';

export const SearchField = styled(TextField)<{ constWidth?: boolean }>(({ theme, constWidth }) => ({
  [theme.breakpoints.up('sm')]: {
    transition: theme.transitions.create('width'),
    width: !constWidth ? '20ch' : undefined,
    '&:focus-within': !constWidth
      ? {
          width: '30ch',
        }
      : {},
  },
  margin: '0 1em',
  '& .MuiInputBase-root': {
    borderRadius: theme.shape.borderRadius,
  },
  '& .MuiInputBase-root::after': {
    border: 'none',
  },
  '& .MuiInputBase-root::before': {
    border: 'none',
  },
  '& .MuiInputBase-root:hover::before': {
    border: 'none !important',
  },
}));

export default SearchField;
