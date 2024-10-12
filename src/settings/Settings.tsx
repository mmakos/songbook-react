import ChordSettings from './chord/ChordSettings.tsx';
import FullscreenPaper from '../components/FullscreenPaper.tsx';
import SongTheme from './song/SongTheme.tsx';
import AppSettings from './app/AppSettings.tsx';

const Settings = () => {
  return (
    <FullscreenPaper>
      <AppSettings/>
      <SongTheme />
      <ChordSettings />
    </FullscreenPaper>
  );
};

export default Settings;
