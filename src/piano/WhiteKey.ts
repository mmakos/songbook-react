import { styled } from '@mui/material';

const WhiteKey = styled('div')({
  width: 'calc(100% / 15 - 2px)',
  aspectRatio: '1 / 4',
  background: 'white',
  zIndex: 1,
  margin: '0 1px',
  borderRadius: '0 0 3px 3px',
  transition: 'all 0.2s',
  cursor: 'pointer',
  ':hover': {
    background: '#aaa'
  },
  '&.selected': {
    background: 'blue',
    ':hover': {
      background: 'darkblue'
    },
  }
});

export default WhiteKey;
