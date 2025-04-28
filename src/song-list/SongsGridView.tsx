import Grid from '@mui/material/Grid2';
import SongCard from './SongCard.tsx';
import { FC } from 'react';
import { TSongFullOverview } from '../types/song.types.ts';

const SongsGridView: FC<{ songs: TSongFullOverview[] }> = ({ songs }) => {
  return (
    <Grid container spacing={1}>
      {songs.map((song) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <SongCard song={song} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SongsGridView;
