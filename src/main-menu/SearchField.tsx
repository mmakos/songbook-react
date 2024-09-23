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
  // transition: theme.transitions.create('width'),
  // width: '12ch',
  // '&:focus': {
  //   width: '20ch',
  // },
  // [theme.breakpoints.up('sm')]: {
  // },
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
