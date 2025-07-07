import { FC, Fragment, useMemo } from 'react';
import { ISongContent } from '../../types/song.types.ts';
import CollapsibleLineRepetition from './CollapsibleVerseRepetition.tsx';
import { initialSpacing } from '../../store/songbook.reducer.ts';
import { useSongContext } from '../SongContext.tsx';

interface ISongTextProps {
  song: ISongContent;
}

const hasRepetition = (song: ISongContent) => {
  for (const verse of song.verses) {
    for (const line of verse.lines) {
      if (line.repetition) return true;
    }
  }
  return false;
};

const SongRepetition: FC<ISongTextProps> = ({ song }) => {
  const {
    spacing,
    fontStyles: { repetition: repetitionStyle },
  } = useSongContext();

  const songHasRepetition = useMemo(() => hasRepetition(song), [song]);

  if (!songHasRepetition) return;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginLeft: `${spacing ? spacing.repetitionSpacing : initialSpacing.repetitionSpacing}${spacing?.pt ? 'pt' : 'ch'}`,
        fontWeight: repetitionStyle.bold ? 'bold' : 'normal',
        fontStyle: repetitionStyle.italic ? 'italic' : 'normal',
        textDecoration: repetitionStyle.underline ? 'underline' : 'none',
      }}
    >
      {song.verses.map((verse, i) => (
        <Fragment key={'v' + i}>
          <CollapsibleLineRepetition verse={verse} song={song} previousVerse={i > 0 ? song.verses[i - 1] : undefined} />
        </Fragment>
      ))}
    </div>
  );
};

export default SongRepetition;
