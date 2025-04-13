import { Edit, InfoOutlined, Verified, YouTube, ZoomIn, ZoomOut } from '@mui/icons-material';
import { SettingsIcon } from '../components/SettingsIcon.tsx';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import {
  changeZoom,
  notifyError,
  notifySuccess,
  setSongInfoOpen,
  setSongSettingsOpen,
  setSongVideoOpen,
  updateSong,
} from '../store/songbook.reducer.ts';
import SongControl, { TSongControlType } from './SongControl.tsx';
import { useNavigate, useParams } from 'react-router';
import useCanEdit from '../store/useCanEdit.hook.ts';
import useAuthAPI from '../http/useAuthAPI.ts';

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
  const { songSlug, username } = useParams();
  const { canEdit, canVerify } = useCanEdit();
  const authAPI = useAuthAPI();

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

  const acceptSong = () => {
    authAPI
      .post(`verify/song/${songSlug}/`)
      .then(() => {
        dispatch(notifySuccess('Zaakceptowano niezweryfikowaną piosenkę'));
        song && dispatch(updateSong({ ...song, created: { ...song.created, verified: true } }));
      })
      .catch(() => dispatch(notifyError('Błąd podczas akceptowania niezweryfikowanej piosenki')));
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
      {canVerify && username && (
        <SongControl
          type={type}
          icon={<Verified />}
          label="Zweryfikuj"
          onClick={() => navigate(`/verify/song/${songSlug}/${username}`)}
        />
      )}
      {canVerify && !username && !song?.created.verified && (
        <SongControl type={type} icon={<Verified />} label="Zaakceptuj" onClick={acceptSong} />
      )}
    </>
  );
};

export default SongControls;
