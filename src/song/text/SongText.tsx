import { FC, Fragment } from 'react';
import { ISongContent } from '../../types/song.types.ts';
import CollapsibleVerseText from './CollapsibleVerseText.tsx';
import { useAppSelector } from '../../store/songbook.store.ts';

interface ISongTextProps {
  song: ISongContent;
}

const SongText: FC<ISongTextProps> = ({ song }) => {
  const textStyle = useAppSelector((state) => state.songbookSettings.songTheme.fontStyles.text);

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
