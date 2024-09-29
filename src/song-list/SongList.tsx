import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import RouteLink from '../components/RouteLink.tsx';
import { useEffect } from 'react';
import { fetchSongList } from '../store/songbook.actions.ts';
import Grid from '@mui/material/Grid2';
import FullscreenPaper from '../components/FullscreenPaper.tsx';

const SongList = () => {
  const songs = useAppSelector((state) => state.songs);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!songs) {
      dispatch(fetchSongList());
    }
  }, []);

  if (!songs) return;

  return (
    <FullscreenPaper>
      <Grid container spacing={1}>
        {songs.map((song) => (
          <Grid key={song.id} size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
            <RouteLink color={'textPrimary'} to={`/songs/${song.id}`}>
              {song.title}
            </RouteLink>
          </Grid>
        ))}
      </Grid>
    </FullscreenPaper>
  );
};

export default SongList;
