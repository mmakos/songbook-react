import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import RouteLink from '../components/RouteLink.tsx';
import { useEffect } from 'react';
import { fetchSongList } from '../store/songbook.actions.ts';
import Grid from '@mui/material/Grid2';
import { Paper, useTheme } from '@mui/material';

const SongList = () => {
  const songs = useAppSelector((state) => state.songs);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  useEffect(() => {
    if (!songs) {
      dispatch(fetchSongList());
    }
  }, []);

  if (!songs) return;

  return (
    <Paper
      sx={{
        my: '1em',
        mx: '10em',
        [theme.breakpoints.down('lg')]: {
          mx: '5em',
        },
        [theme.breakpoints.down('md')]: {
          mx: '1em',
        },
        padding: '1em 2em',
      }}
    >
      <Grid container spacing={1}>
        {songs.map((song) => (
          <Grid key={song.id} size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
            <RouteLink color={'textPrimary'} to={`/songs/${song.id}`}>
              {song.title}
            </RouteLink>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SongList;
