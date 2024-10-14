import { Divider, FormControlLabel, Switch, Typography } from '@mui/material';
import FontChooser from '../../components/font/FontChooser.tsx';
import FontStyle from '../../components/font/FontStyle.tsx';
import FontSpacing from '../../components/font/FontSpacing.tsx';
import { useAppDispatch, useAppSelector } from '../../store/songbook.store.ts';
import {
  setSongThemeCustomFont,
  setSongThemeCustomSpacing,
  setSongThemeFont,
  setSongThemeMode,
  setSongThemeRepetitionFontStyle,
  setSongThemeSpacing,
  setSongThemeText1FontStyle,
  setSongThemeText2FontStyle,
  setSongThemeText3FontStyle,
  setSongThemeTextFontStyle,
} from '../../store/songbook.reducer.ts';
import ThemeChooser from '../../components/ThemeChooser.tsx';

const SongTheme = () => {
  const {
    font,
    customFont,
    fontStyles: { text, text1, text2, text3, repetition },
    spacing,
    customSpacing,
    mode,
  } = useAppSelector((state) => state.songbookSettings.songTheme);
  const dispatch = useAppDispatch();

  return (
    <div style={{ marginBottom: '2em' }}>
      <Typography variant="h4">Wyświetlanie piosenki</Typography>
      <Divider variant="fullWidth" sx={{ mt: '0.5em', mb: '1em' }} />
      <Typography mb="0.5em">Motyw piosenki</Typography>
      <ThemeChooser
        fullWidth
        sx={{ maxWidth: '40ch' }}
        changeTheme={(theme) => dispatch(setSongThemeMode(theme))}
        theme={mode}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <FormControlLabel
          control={<Switch checked={!!customFont} onChange={(_, value) => dispatch(setSongThemeCustomFont(value))} />}
          label={'Własna czcionka'}
          sx={{ mb: '0.5em', mt: '1em' }}
        />
        <FontChooser
          value={font}
          onChange={(font) => dispatch(setSongThemeFont(font))}
          disabled={!customFont}
          maxWidth="40ch"
        />
        <FormControlLabel
          control={
            <Switch checked={!!customSpacing} onChange={(_, value) => dispatch(setSongThemeCustomSpacing(value))} />
          }
          label={'Własne odstępy'}
          sx={{ mb: '0.5em', mt: '1em' }}
        />
        <FontSpacing
          spacing={spacing}
          setSpacing={(spacing) => dispatch(setSongThemeSpacing(spacing))}
          disabled={!customSpacing}
          maxWidth="40ch"
        />
        <Typography variant="h5" sx={{ mt: '1rem' }}>
          Styl tekstu
        </Typography>
        <Divider variant="fullWidth" sx={{ mt: '0.5em', mb: '1em' }} />
        <div
          style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '40ch', alignItems: 'center', marginBottom: '0.5em' }}
        >
          <Typography variant="h6" marginRight="auto" paddingRight="11ch">
            Tekst
          </Typography>
          <FontStyle fontStyle={text} setFontStyle={(fontStyle) => dispatch(setSongThemeTextFontStyle(fontStyle))} />
        </div>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '40ch', alignItems: 'center', marginBottom: '0.5em' }}
        >
          <Typography variant="h6" marginRight="auto" paddingRight="1em">
            Tekst specjalny 1
          </Typography>
          <FontStyle fontStyle={text1} setFontStyle={(fontStyle) => dispatch(setSongThemeText1FontStyle(fontStyle))} />
        </div>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '40ch', alignItems: 'center', marginBottom: '0.5em' }}
        >
          <Typography variant="h6" marginRight="auto" paddingRight="1em">
            Tekst specjalny 2
          </Typography>
          <FontStyle fontStyle={text2} setFontStyle={(fontStyle) => dispatch(setSongThemeText2FontStyle(fontStyle))} />
        </div>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '40ch', alignItems: 'center', marginBottom: '0.5em' }}
        >
          <Typography variant="h6" marginRight="auto" paddingRight="1em">
            Tekst specjalny 3
          </Typography>
          <FontStyle fontStyle={text3} setFontStyle={(fontStyle) => dispatch(setSongThemeText3FontStyle(fontStyle))} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '40ch', alignItems: 'center' }}>
          <Typography variant="h6" marginRight="auto" paddingRight="5ch">
            Powtórzenia
          </Typography>
          <FontStyle
            fontStyle={repetition}
            setFontStyle={(fontStyle) => dispatch(setSongThemeRepetitionFontStyle(fontStyle))}
          />
        </div>
      </div>
    </div>
  );
};

export default SongTheme;
