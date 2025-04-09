import { Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/songbook.store.ts';
import { changeTheme } from '../../store/songbook.reducer.ts';
import ThemeChooser from '../../components/ThemeChooser.tsx';
import SettingsSection from '../SettingsSection.tsx';

const AppSettings = () => {
  const themeMode = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  return (
    <SettingsSection title="Ustawienia śpiewnika">
      <Typography>Motyw śpiewnika</Typography>
      <ThemeChooser
        fullWidth
        sx={{ maxWidth: '40ch' }}
        changeTheme={(theme) => dispatch(changeTheme(theme))}
        theme={themeMode}
      />
    </SettingsSection>
  );
};

export default AppSettings;
