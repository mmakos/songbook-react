import { FC, Fragment } from 'react';
import { TSongFullOverview } from '../types/song.types.ts';
import { Divider, List } from '@mui/material';
import SongListElement from './SongListElement.tsx';

const SongsListView: FC<{ songs: TSongFullOverview[] }> = ({ songs }) => {
  return (
    <List>
      <Divider />
      {songs.map((song) => (
        <Fragment key={song.slug}>
          <SongListElement song={song} />
          <Divider />
        </Fragment>
      ))}
    </List>
  );
};

export default SongsListView;
