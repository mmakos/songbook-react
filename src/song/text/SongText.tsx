import { FC, Fragment } from 'react';
import { ISongContent } from '../../types/song.types.ts';
import CollapsibleVerseText from './CollapsibleVerseText.tsx';
import { useSongContext } from '../SongContext.tsx';

interface ISongTextProps {
  song: ISongContent;
}

const SongText: FC<ISongTextProps> = ({ song }) => {
  const {
    fontStyles: { text: textStyle },
  } = useSongContext();

  let mainVerseNumber = 1;
  return (
    <div
      style={{
        fontWeight: textStyle.bold ? 'bold' : 'normal',
        fontStyle: textStyle.italic ? 'italic' : 'normal',
        textDecoration: textStyle.underline ? 'underline' : 'none',
        position: 'relative',
      }}
    >
      {song.verses.map((verse, i) => (
        <Fragment key={'v' + i}>
          <CollapsibleVerseText verse={verse} song={song} verseNumber={verse.indent ? undefined : mainVerseNumber++} />
        </Fragment>
      ))}
    </div>
  );
};

export default SongText;
