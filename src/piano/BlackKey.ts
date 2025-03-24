import { styled } from '@mui/material';
import {PIANO_WHITE_KEYS} from "./piano.types.ts";

const BLACK_TO_WHITE_KEY_RATIO = 5 / 9;

const BlackKey = styled('div')({
  width: `calc(100% / ${PIANO_WHITE_KEYS / BLACK_TO_WHITE_KEY_RATIO})`,
  height: '60%',
  background: 'black',
  zIndex: 2,
  margin: `0 calc(-100% / ${PIANO_WHITE_KEYS / BLACK_TO_WHITE_KEY_RATIO * 2})`,
  borderRadius: '0 0 5px 5px',
  boxShadow: '0px 10px 10px grey',
  transition: 'all 0.2s',
  cursor: 'pointer',
  ':hover': {
    boxShadow: '0px 5px 5px grey',
    background: '#333',
  },
  '&.selected': {
    background: 'darkblue',
    ':hover': {
      background: 'blue',
    },
  },
});

export default BlackKey;
