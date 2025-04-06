import { Edit, InfoOutlined, Verified, YouTube, ZoomIn, ZoomOut } from '@mui/icons-material';
import { SettingsIcon } from '../components/SettingsIcon.tsx';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { changeZoom, setSongInfoOpen, setSongSettingsOpen, setSongVideoOpen } from '../store/songbook.reducer.ts';
import SongControl, { TSongControlType } from './SongControl.tsx';
import { useNavigate, useParams } from 'react-router';
import useCanEdit from '../store/useCanEdit.hook.ts';

interface ISongControlsProps {
  video?: boolean;
  type: TSongControlType;
}

const SongControls: FC<ISongControlsProps> = ({ video, type }) => {
  const noChords = useAppSelector((state) => state.songbookSettings.noChordInfo);
  const song = useAppSelector((state) => state.song);
  const { videoOpen, settingsOpen, infoOpen, zoom } = useAppSelector((state) => state.songDisplayState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { songSlug } = useParams();
  const { canEdit, canVerify } = useCanEdit();

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
      {canEdit && (
        <SongControl type={type} icon={<Edit />} label="Edytuj" onClick={() => navigate(`/edit/song/${songSlug}`)} />
      )}
      {canVerify && (song?.waiting?.length || !song?.created.verified) && (
        <SongControl
          type={type}
          icon={<Verified />}
          label="Zweryfikuj"
          onClick={() => navigate(`/verify/song/${songSlug}`)}
        />
      )}
    </>
  );
};

export default SongControls;
