import { FC } from 'react';
import { TSongFullOverview } from '../types/song.types.ts';
import { Divider, List } from '@mui/material';
import SongListElement from './SongListElement.tsx';

const SongsListView: FC<{ songs: TSongFullOverview[] }> = ({ songs }) => {
  return (
    <List>
      <Divider />
      {songs.map((song) => (
        <>
          <SongListElement song={song} />
          <Divider />
        </>
      ))}
    </List>
  );
};

export default SongsListView;
