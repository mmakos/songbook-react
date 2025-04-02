import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
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
import SettingsSection from '../SettingsSection.tsx';

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
    <SettingsSection title="Wyświetlanie piosenki">
      <Typography>Motyw piosenki</Typography>
      <ThemeChooser
        fullWidth
        sx={{ maxWidth: '40ch' }}
        changeTheme={(theme) => dispatch(setSongThemeMode(theme))}
        theme={mode}
        systemLabel="Aplikacji"
      />
      <Stack spacing={1}>
        <FormControlLabel
          control={<Switch checked={!!customFont} onChange={(_, value) => dispatch(setSongThemeCustomFont(value))} />}
          label={'Własna czcionka'}
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
        />
        <FontSpacing
          spacing={spacing}
          setSpacing={(spacing) => dispatch(setSongThemeSpacing(spacing))}
          disabled={!customSpacing}
          maxWidth="40ch"
        />
      </Stack>
      <SettingsSection titleVariant="h5" title="Styl tekstu">
        <Stack direction="row" flexWrap="wrap" maxWidth="40ch" alignItems="center">
          <Typography variant="h6" marginRight="auto" paddingRight="11ch">
            Tekst
          </Typography>
          <FontStyle fontStyle={text} setFontStyle={(fontStyle) => dispatch(setSongThemeTextFontStyle(fontStyle))} />
        </Stack>
        <Stack direction="row" flexWrap="wrap" maxWidth="40ch" alignItems="center">
          <Typography variant="h6" marginRight="auto" paddingRight="1em">
            Tekst specjalny 1
          </Typography>
          <FontStyle fontStyle={text1} setFontStyle={(fontStyle) => dispatch(setSongThemeText1FontStyle(fontStyle))} />
        </Stack>
        <Stack direction="row" flexWrap="wrap" maxWidth="40ch" alignItems="center">
          <Typography variant="h6" marginRight="auto" paddingRight="1em">
            Tekst specjalny 2
          </Typography>
          <FontStyle fontStyle={text2} setFontStyle={(fontStyle) => dispatch(setSongThemeText2FontStyle(fontStyle))} />
        </Stack>
        <Stack direction="row" flexWrap="wrap" maxWidth="40ch" alignItems="center">
          <Typography variant="h6" marginRight="auto" paddingRight="1em">
            Tekst specjalny 3
          </Typography>
          <FontStyle fontStyle={text3} setFontStyle={(fontStyle) => dispatch(setSongThemeText3FontStyle(fontStyle))} />
        </Stack>
        <Stack direction="row" flexWrap="wrap" maxWidth="40ch" alignItems="center">
          <Typography variant="h6" marginRight="auto" paddingRight="5ch">
            Powtórzenia
          </Typography>
          <FontStyle
            fontStyle={repetition}
            setFontStyle={(fontStyle) => dispatch(setSongThemeRepetitionFontStyle(fontStyle))}
          />
        </Stack>
      </SettingsSection>
    </SettingsSection>
  );
};

export default SongTheme;
