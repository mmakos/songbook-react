import { FC, Fragment } from 'react';
import { ISong } from '../../types/song.types.ts';
import CollapsibleVerseChords from './CollapsibleVerseChords.tsx';

interface ISongChordsProps {
  song: ISong;
}

const SongChords: FC<ISongChordsProps> = ({ song }) => {
  return (
    <div style={{ marginLeft: '5em', fontWeight: 'bold' }}>
      {song.verses.map((verse, i) => (
        <Fragment key={'v' + i}>
          <CollapsibleVerseChords verse={verse} song={song} />
        </Fragment>
      ))}
    </div>
  );
};

export default SongChords;
