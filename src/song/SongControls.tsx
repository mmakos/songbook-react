import { InfoOutlined, YouTube, ZoomIn, ZoomOut } from '@mui/icons-material';
import { SettingsIcon } from '../components/SettingsIcon.tsx';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { changeZoom, setSongInfoOpen, setSongSettingsOpen, setSongVideoOpen } from '../store/songbook.reducer.ts';
import SongControl, { TSongControlType } from './SongControl.tsx';

interface ISongControlsProps {
  video?: boolean;
  type: TSongControlType;
}

const SongControls: FC<ISongControlsProps> = ({ video, type }) => {
  const noChords = useAppSelector((state) => state.songbookSettings.noChordInfo);
  const { videoOpen, settingsOpen, infoOpen, zoom } = useAppSelector((state) => state.songDisplayState);
  const dispatch = useAppDispatch();

  const toggleSettingsOpen = () => {
    dispatch(setSongSettingsOpen(!settingsOpen));
  };

  const toggleInfoOpen = () => {
    dispatch(setSongInfoOpen(!infoOpen));
  };

  const toggleVideoOpen = () => {
    dispatch(setSongVideoOpen(!videoOpen));
  };

  const toggleZoom = () => {
    dispatch(changeZoom(zoom === 'small' ? 'normal' : 'small'));
  };

  return (
    <>
      {zoom && (
        <SongControl
          type={type}
          icon={zoom === 'small' ? <ZoomIn /> : <ZoomOut />}
          label={zoom === 'small' ? 'Przybliż' : 'Oddal'}
          onClick={toggleZoom}
          selected={zoom === 'small'}
        />
      )}
      <SongControl
        type={type}
        icon={<InfoOutlined />}
        label="Informacje"
        onClick={toggleInfoOpen}
        selected={infoOpen}
      />
      {!noChords && (
        <SongControl
          type={type}
          icon={<SettingsIcon />}
          label="Ustawienia"
          onClick={toggleSettingsOpen}
          selected={settingsOpen}
        />
      )}
      {video && (
        <SongControl type={type} icon={<YouTube />} label="Nagranie" onClick={toggleVideoOpen} selected={videoOpen} />
      )}
    </>
  );
};

export default SongControls;
