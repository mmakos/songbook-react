import ChordSettings from './chord/ChordSettings.tsx';
import FullscreenPaper from '../components/FullscreenPaper.tsx';
import SongTheme from './song/SongTheme.tsx';

const Settings = () => {
  return (
    <FullscreenPaper>
      <SongTheme />
      <ChordSettings />
    </FullscreenPaper>
  );
};

export default Settings;
