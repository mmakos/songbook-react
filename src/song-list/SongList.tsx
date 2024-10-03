import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import RouteLink from '../components/RouteLink.tsx';
import { useEffect, useMemo } from 'react';
import { fetchSongList } from '../store/songbook.actions.ts';
import Grid from '@mui/material/Grid2';
import FullscreenPaper from '../components/FullscreenPaper.tsx';
import { useParams } from 'react-router-dom';

const SongList = () => {
  const songs = useAppSelector((state) => state.songs);
  const { category } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!songs) {
      dispatch(fetchSongList());
    }
  }, []);

  const categorySongs = useMemo(() => {
    if (!songs) return undefined;
    const filteredSongs = category ? songs.filter((song) => song.category === category) : [...songs];
    filteredSongs.sort((a, b) => a.title.localeCompare(b.title));
    return filteredSongs;
  }, [songs, category]);

  if (!categorySongs) return;

  return (
    <FullscreenPaper>
      <Grid container spacing={1}>
        {categorySongs.map((song) => (
          <Grid key={song.slug} size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
            <RouteLink color={'textPrimary'} to={`/song/${song.slug}`}>
              {song.title}
            </RouteLink>
          </Grid>
        ))}
      </Grid>
    </FullscreenPaper>
  );
};

export default SongList;
