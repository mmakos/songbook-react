import { Typography } from '@mui/material';
import FontStyle from '../../components/font/FontStyle.tsx';
import { setSongThemeChordsFontStyle, setSongThemeSilentChordsFontStyle } from '../../store/songbook.reducer.ts';
import { useAppDispatch, useAppSelector } from '../../store/songbook.store.ts';

const ChordStyle = () => {
  const { chords, silentChords } = useAppSelector((state) => state.songbookSettings.songTheme.fontStyles);
  const dispatch = useAppDispatch();

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '40ch', alignItems: 'center', marginBottom: '0.5em' }}>
        <Typography variant="h6" marginRight="auto" paddingRight="7ch">
          Akordy
        </Typography>
        <FontStyle fontStyle={chords} setFontStyle={(fontStyle) => dispatch(setSongThemeChordsFontStyle(fontStyle))} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '40ch', alignItems: 'center', marginBottom: '0.5em' }}>
        <Typography variant="h6" marginRight="auto" paddingRight="1em">
          Ciche akordy
        </Typography>
        <FontStyle
          fontStyle={silentChords}
          setFontStyle={(fontStyle) => dispatch(setSongThemeSilentChordsFontStyle(fontStyle))}
        />
      </div>
    </>
  );
};

export default ChordStyle;
