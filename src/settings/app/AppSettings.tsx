import { Divider, PaletteMode, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/songbook.store.ts';
import { changeTheme } from '../../store/songbook.reducer.ts';
import { DarkModeOutlined, LightMode, SettingsBrightness } from '@mui/icons-material';

const AppSettings = () => {
  const themeMode = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  const changeSongThemeMode = (value: string) => {
    let palette: PaletteMode | undefined;
    if (value === 'dark') palette = 'dark';
    if (value === 'light') palette = 'light';
    dispatch(changeTheme(palette));
  };

  return (
    <div style={{ marginBottom: '2em' }}>
      <Typography variant="h4">Ustawienia śpiewnika</Typography>
      <Divider variant="fullWidth" sx={{ mt: '0.5em', mb: '1em' }} />
      <Typography mb="0.5em">Motyw śpiewnika</Typography>
      <ToggleButtonGroup
        exclusive
        fullWidth
        sx={{ maxWidth: '40ch' }}
        value={themeMode ?? 'system'}
        onChange={(_, value) => changeSongThemeMode(value)}
      >
        <ToggleButton value="light">
          <DarkModeOutlined sx={{ mr: '0.3em' }} />
          Jasny
        </ToggleButton>
        <ToggleButton value="system">
          <SettingsBrightness sx={{ mr: '0.3em' }} />
          Systemu
        </ToggleButton>
        <ToggleButton value="dark">
          <LightMode sx={{ mr: '0.3em' }} />
          Ciemny
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default AppSettings;
