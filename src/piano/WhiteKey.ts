import { styled } from '@mui/material';
import {PIANO_WHITE_KEYS} from "./piano.types.ts";

const WhiteKey = styled('div')({
  width: `calc(100% / ${PIANO_WHITE_KEYS} - 2px)`,
  aspectRatio: '1 / 4',
  background: 'white',
  zIndex: 1,
  margin: '0 1px',
  borderRadius: '0 0 5px 5px',
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
