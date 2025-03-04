import { FC, useEffect } from 'react';
import { Divider, IconButton, Paper, Skeleton } from '@mui/material';
import SongInfo from './SongInfo.tsx';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { getSong } from '../store/songbook.actions.ts';
import { clearSong } from '../store/songbook.reducer.ts';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import EditorInfo from './EditorInfo.tsx';
import SongTitle from './SongTitle.tsx';
import BasicTooltip from '../components/BasicTooltip.tsx';
import SongSettings from './SongSettings.tsx';
import SongRoute from './SongRoute.tsx';
import SongContent from './SongContent.tsx';
import SongVideo from './SongVideo.tsx';
import SongControls from './SongControls.tsx';
import NotFound from '../subsites/NotFound.tsx';

const Song: FC = () => {
  const song = useAppSelector((state) => state.song);
  const songTimeout = useAppSelector((state) => state.songTimeout);
  const noChords = useAppSelector((state) => state.songbookSettings.noChordInfo);
  const dispatch = useAppDispatch();
  const { songSlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    songSlug && dispatch(getSong(songSlug));
  }, [songSlug]);

  useEffect(() => {
    return () => {
      dispatch(clearSong());
    };
  }, []);

  const previousSong = () => {
    if (song?.previous) {
      dispatch(clearSong());
      navigate(`/song/${song.previous.slug}`);
    }
  };

  const nextSong = () => {
    if (song?.next) {
      dispatch(clearSong());
      navigate(`/song/${song.next.slug}`);
    }
  };

  if (songTimeout) {
    return <NotFound />;
  }

  return (
    <div style={{ position: 'relative', alignItems: 'center', maxWidth: '100%' }}>
      {song?.previous && (
        <BasicTooltip title={`Poprzednia piosenka: ${song.previous.title}`}>
          <IconButton sx={{ position: 'fixed', top: '50%', left: '0.5em' }} onClick={previousSong}>
            <ArrowBackIosNew />
          </IconButton>
        </BasicTooltip>
      )}
      <div style={{ flex: 1 }}>
        <SongTitle />
        <SongRoute />
        <div
          style={{
            marginBottom: '0.5em',
            display: 'flex',
            flexWrap: 'nowrap',
            overflow: 'auto',
            gap: '0.5em',
            scrollbarWidth: 'none',
          }}
        >
          <SongControls type="chip" video={!!song?.video} />
        </div>
        <SongInfo />
        <SongVideo />
        {!noChords && <SongSettings />}
        <Paper>
          <SongContent />
          <Divider variant="middle" />
          <div style={{ display: 'flex', flexDirection: 'column', padding: '0.5em 1em' }}>
            {song ? <EditorInfo prefix="Utworzono" editorInfo={song.created} /> : <Skeleton />}
            {song?.edited && <EditorInfo prefix="Edytowano" editorInfo={song.edited} />}
          </div>
        </Paper>
      </div>
      {song?.next && (
        <BasicTooltip title={`Następna piosenka: ${song.next.title}`}>
          <IconButton sx={{ position: 'fixed', right: '0.5em', top: '50%' }} onClick={nextSong}>
            <ArrowForwardIos />
          </IconButton>
        </BasicTooltip>
      )}
    </div>
  );
};

export default Song;
