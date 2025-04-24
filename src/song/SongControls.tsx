import {Edit, InfoOutlined, PlaylistAdd, PlaylistAddCheck, Verified, YouTube, ZoomIn, ZoomOut} from '@mui/icons-material';
import { SettingsIcon } from '../components/SettingsIcon.tsx';
import { FC, useMemo } from 'react';
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
import useMeeting from '../store/useMeeting.ts';

const SongControls: FC<{ type: TSongControlType; preview?: boolean }> = ({ type, preview }) => {
  const noChords = useAppSelector((state) => state.songbookSettings.noChordInfo);
  const song = useAppSelector((state) => state.song);
  const { videoOpen, settingsOpen, infoOpen, zoom } = useAppSelector((state) => state.songDisplayState);
  const meeting = useMeeting();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { songSlug, username } = useParams();
  const { canEdit, canVerify } = useCanEdit();
  const user = useAppSelector((state) => state.user);
  const authAPI = useAuthAPI();

  const inMeeting = useMemo(() => {
    return song?.slug && meeting?.songs.find((s) => s.slug === song.slug);
  }, [meeting, song?.slug]);

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

  const addToMeeting = () => {
    if (!meeting || !song) return;
    authAPI
      .post(`meeting/${meeting.id}/add-song/`, { song: song.slug })
      .then(() => {})
      .catch(() => dispatch(notifyError('Błąd podczas dodawania piosenki do spotkania')));
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

  const getEditHref = () => {
    const baseHref = `/edit/song/${songSlug}`;
    if (username) return `${baseHref}/${username}`;
    if (song?.waiting && user && song.waiting.find((w) => w.username === user.username)) {
      return `${baseHref}/${user.username}`;
    }
    return baseHref;
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
      {song?.video && (
        <SongControl type={type} icon={<YouTube />} label="Nagranie" onClick={toggleVideoOpen} selected={videoOpen} />
      )}
      {meeting && !preview && !inMeeting ? (
        <SongControl type={type} icon={<PlaylistAdd />} label="Do śpiewanek" onClick={addToMeeting} />
      ) : (
        <SongControl type={type} icon={<PlaylistAddCheck/>} label="Zaśpiewano" onClick={addToMeeting} />
      )}
      {canEdit && !preview && (
        <SongControl type={type} icon={<Edit />} label="Edytuj" onClick={() => navigate(getEditHref())} />
      )}
      {canVerify && username && !preview && (
        <SongControl
          type={type}
          icon={<Verified />}
          label="Zweryfikuj"
          onClick={() => navigate(`/verify/song/${songSlug}/${username}`)}
        />
      )}
      {canVerify && !username && !preview && !song?.created.verified && (
        <SongControl type={type} icon={<Verified />} label="Zaakceptuj" onClick={acceptSong} />
      )}
    </>
  );
};

export default SongControls;
