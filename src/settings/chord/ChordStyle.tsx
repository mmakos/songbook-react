import { Stack, Typography } from '@mui/material';
import FontStyle from '../../components/font/FontStyle.tsx';
import { IFontStyles } from '../../store/songbook.reducer.ts';
import { FC } from 'react';

interface IChordStyleProps {
  fontStyles: IFontStyles;
  setFontStyles: (fontStyles: IFontStyles) => void;
  maxWidth?: string;
}

const ChordStyle: FC<IChordStyleProps> = ({ fontStyles, setFontStyles, maxWidth }) => {
  return (
    <Stack spacing={1}>
      <Stack direction="row" flexWrap="wrap" maxWidth={maxWidth} alignItems="center">
        <Typography variant="h6" marginRight="auto" paddingRight="7ch">
          Akordy
        </Typography>
        <FontStyle
          fontStyle={fontStyles.chords}
          setFontStyle={(fontStyle) => setFontStyles({ ...fontStyles, chords: fontStyle })}
        />
      </Stack>
      <Stack direction="row" flexWrap="wrap" maxWidth={maxWidth} alignItems="center">
        <Typography variant="h6" marginRight="auto" paddingRight="1em">
          Ciche akordy
        </Typography>
        <FontStyle
          fontStyle={fontStyles.silentChords}
          setFontStyle={(fontStyle) => setFontStyles({ ...fontStyles, silentChords: fontStyle })}
        />
      </Stack>
    </Stack>
  );
};

export default ChordStyle;
