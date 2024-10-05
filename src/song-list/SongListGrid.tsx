import React, { FC } from 'react';
import Grid from '@mui/material/Grid2';
import RouteLink from '../components/RouteLink.tsx';
import { ISongOverview } from '../types/song.types.ts';

interface ISongListGridProps {
  songs: ISongOverview[];
}

const SongListGrid: FC<ISongListGridProps> = ({ songs }) => {
  let size;
  if (songs.length < 10) {
    size = {xs: 12};
  } else if (songs.length < 20) {
    size = {xs: 12, md: 6};
  } else if (songs.length < 30) {
    size = {xs: 12, md: 6, lg: 4};
  } else {
    size = {xs: 12, md: 6, lg: 4, xl: 3};
  }

  return (
    <Grid container spacing={1}>
      {songs.map((song) => (
        <Grid key={song.slug} size={size}>
          <RouteLink color={'textPrimary'} to={`/song/${song.slug}`}>
            {song.title}
          </RouteLink>
        </Grid>
      ))}
    </Grid>
  );
};

export default SongListGrid;
