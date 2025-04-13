import { FC, Fragment, useMemo } from 'react';
import { ISongContent } from '../../types/song.types.ts';
import CollapsibleLineRepetition from './CollapsibleVerseRepetition.tsx';
import { useAppSelector } from '../../store/songbook.store.ts';
import { initialSongbookState } from '../../store/songbook.reducer.ts';

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
    spacing: { repetitionSpacing },
    customSpacing,
    fontStyles: { repetition: repetitionStyle },
  } = useAppSelector((state) => state.songbookSettings.songTheme);

  const songHasRepetition = useMemo(() => hasRepetition(song), [song]);

  if (!songHasRepetition) return;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginLeft: `${customSpacing ? repetitionSpacing : initialSongbookState.songbookSettings.songTheme.spacing.repetitionSpacing}ch`,
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
