import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import FontChooser from '../../components/font/FontChooser.tsx';
import FontSpacing from '../../components/font/FontSpacing.tsx';
import { useAppDispatch, useAppSelector } from '../../store/songbook.store.ts';
import {
  setSongThemeCustomFont,
  setSongThemeCustomSpacing,
  setSongThemeFont,
  setSongThemeFontStyles,
  setSongThemeMode,
  setSongThemeSpacing,
  setTextSettings,
} from '../../store/songbook.reducer.ts';
import ThemeChooser from '../../components/ThemeChooser.tsx';
import SettingsSection from '../SettingsSection.tsx';
import FontStyles from '../../components/font/FontStyles.tsx';
import TextSettings from './TextSettings.tsx';

const SongTheme = () => {
  const { font, customFont, fontStyles, spacing, customSpacing, mode } = useAppSelector(
    (state) => state.songbookSettings.songTheme
  );
  const textSettings = useAppSelector((state) => state.songbookSettings.textSettings);
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
        <FontStyles styles={fontStyles} setStyles={(s) => dispatch(setSongThemeFontStyles(s))} maxWidth="40ch" />
      </SettingsSection>
      <SettingsSection titleVariant="h5" title="Tekst piosenki">
        <TextSettings textSettings={textSettings} setTextSettings={(s) => dispatch(setTextSettings(s))} />
      </SettingsSection>
    </SettingsSection>
  );
};

export default SongTheme;
