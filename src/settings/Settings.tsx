import ChordSettings from './chord/ChordSettings.tsx';
import SongTheme from './song/SongTheme.tsx';
import AppSettings from './app/AppSettings.tsx';
import { Paper, Stack } from '@mui/material';

const Settings = () => {
  return (
    <Paper sx={{ padding: '1em 2em' }}>
      <Stack spacing={2}>
        <AppSettings />
        <SongTheme />
        <ChordSettings />
      </Stack>
    </Paper>
  );
};

export default Settings;
