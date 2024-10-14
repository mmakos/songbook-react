import { Divider, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/songbook.store.ts';
import { changeTheme } from '../../store/songbook.reducer.ts';
import ThemeChooser from '../../components/ThemeChooser.tsx';

const AppSettings = () => {
  const themeMode = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  return (
    <div style={{ marginBottom: '2em' }}>
      <Typography variant="h4">Ustawienia śpiewnika</Typography>
      <Divider variant="fullWidth" sx={{ mt: '0.5em', mb: '1em' }} />
      <Typography mb="0.5em">Motyw śpiewnika</Typography>
      <ThemeChooser
        fullWidth
        sx={{ maxWidth: '40ch' }}
        changeTheme={(theme) => dispatch(changeTheme(theme))}
        theme={themeMode}
      />
    </div>
  );
};

export default AppSettings;
