import ChordSettings from './chord/ChordSettings.tsx';
import SongTheme from './song/SongTheme.tsx';
import AppSettings from './app/AppSettings.tsx';
import { Paper, Stack } from '@mui/material';
import BasicHelmet from '../subsites/BasicHelmet.tsx';

const Settings = () => {
  return (
    <Paper sx={{ padding: '1em 2em' }}>
      <BasicHelmet title="Ustawienia"/>
      <Stack spacing={2}>
        <AppSettings />
        <SongTheme />
        <ChordSettings />
      </Stack>
    </Paper>
  );
};

export default Settings;
