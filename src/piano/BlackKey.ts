import { styled } from '@mui/material';

const BlackKey = styled('div')({
  width: 'calc(100% / 27)',
  height: '60%',
  background: 'black',
  zIndex: 2,
  margin: '0 calc(-100% / 54)',
  borderRadius: '0 0 3px 3px',
  boxShadow: '0px 10px 10px grey',
  transition: 'all 0.2s',
  cursor: 'pointer',
  ':hover': {
    boxShadow: '0px 5px 5px grey',
    background: '#333'
  },
  '&.selected': {
    background: 'darkblue',
    ':hover': {
      background: 'blue'
    },
  }
});

export default BlackKey;
