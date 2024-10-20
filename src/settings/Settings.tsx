import ChordSettings from './chord/ChordSettings.tsx';
import SongTheme from './song/SongTheme.tsx';
import AppSettings from './app/AppSettings.tsx';
import { Paper } from '@mui/material';

const Settings = () => {
  return (
    <Paper sx={{ padding: '1em 2em' }}>
      <AppSettings />
      <SongTheme />
      <ChordSettings />
    </Paper>
  );
};

export default Settings;
