import { FC, Fragment } from 'react';
import { ISong } from '../../types/song.types.ts';
import CollapsibleVerseText from './CollapsibleVerseText.tsx';

interface ISongTextProps {
  song: ISong;
}

const SongText: FC<ISongTextProps> = ({ song }) => {
  return (
    <div>
      {song.verses.map((verse, i) => (
        <Fragment key={'v' + i}>
          <CollapsibleVerseText verse={verse} song={song} />
        </Fragment>
      ))}
    </div>
  );
};

export default SongText;
