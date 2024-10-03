import { styled, TextField } from '@mui/material';

export const SearchField = styled(TextField)(({ theme }) => ({
  transition: theme.transitions.create('width'),
  margin: '0 1em',
  width: '20ch',
  '&:focus-within': {
    width: '30ch',
  },
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
