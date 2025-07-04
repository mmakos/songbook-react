import { IFontStyles } from '../../store/songbook.reducer.ts';
import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import FontStyle from './FontStyle.tsx';

interface IFontStylesProps {
  styles: IFontStyles;
  setStyles: (styles: IFontStyles) => void;
  maxWidth?: string;
}

const FontStyles: FC<IFontStylesProps> = ({ styles, setStyles, maxWidth }) => {
  return (
    <Stack spacing={1}>
      <Stack direction="row" flexWrap="wrap" maxWidth={maxWidth} alignItems="center">
        <Typography variant="h6" marginRight="auto" paddingRight="11ch">
          Tekst
        </Typography>
        <FontStyle fontStyle={styles.text} setFontStyle={(fontStyle) => setStyles({ ...styles, text: fontStyle })} />
      </Stack>
      <Stack direction="row" flexWrap="wrap" maxWidth={maxWidth} alignItems="center">
        <Typography variant="h6" marginRight="auto" paddingRight="1em">
          Tekst specjalny 1
        </Typography>
        <FontStyle fontStyle={styles.text1} setFontStyle={(fontStyle) => setStyles({ ...styles, text1: fontStyle })} />
      </Stack>
      <Stack direction="row" flexWrap="wrap" maxWidth={maxWidth} alignItems="center">
        <Typography variant="h6" marginRight="auto" paddingRight="1em">
          Tekst specjalny 2
        </Typography>
        <FontStyle fontStyle={styles.text2} setFontStyle={(fontStyle) => setStyles({ ...styles, text2: fontStyle })} />
      </Stack>
      <Stack direction="row" flexWrap="wrap" maxWidth={maxWidth} alignItems="center">
        <Typography variant="h6" marginRight="auto" paddingRight="1em">
          Tekst specjalny 3
        </Typography>
        <FontStyle fontStyle={styles.text3} setFontStyle={(fontStyle) => setStyles({ ...styles, text3: fontStyle })} />
      </Stack>
      <Stack direction="row" flexWrap="wrap" maxWidth={maxWidth} alignItems="center">
        <Typography variant="h6" marginRight="auto" paddingRight="5ch">
          Powtórzenia
        </Typography>
        <FontStyle
          fontStyle={styles.repetition}
          setFontStyle={(fontStyle) => setStyles({ ...styles, repetition: fontStyle })}
        />
      </Stack>
    </Stack>
  );
};

export default FontStyles;
