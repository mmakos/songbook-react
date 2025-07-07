import { FC, Fragment, useMemo } from 'react';
import { IChords, ISongContent } from '../../types/song.types.ts';
import CollapsibleVerseChords from './CollapsibleVerseChords.tsx';
import { initialSpacing } from '../../store/songbook.reducer.ts';
import { useSongContext } from '../SongContext.tsx';

interface ISongChordsProps {
  song: ISongContent;
  chordsType: keyof IChords;
}

const hasChords = (song: ISongContent, chordsType: keyof IChords) => {
  for (const verse of song.verses) {
    for (const line of verse.lines) {
      if (line.chords?.[chordsType]) return true;
    }
  }
  return false;
};

const SongChords: FC<ISongChordsProps> = ({ song, chordsType }) => {
  const {
    fontStyles: { chords: chordStyle },
    spacing,
  } = useSongContext();

  const songHasChords = useMemo(() => hasChords(song, chordsType), [song, chordsType]);

  if (!songHasChords) return;

  return (
    <div
      style={{
        marginLeft: `${spacing ? spacing.chordsSpacing : initialSpacing.chordsSpacing}${spacing?.pt ? 'pt' : 'ch'}`,
        fontWeight: chordStyle.bold ? 'bold' : 'normal',
        fontStyle: chordStyle.italic ? 'italic' : 'normal',
        textDecoration: chordStyle.underline ? 'underline' : 'none',
      }}
    >
      {song.verses.map((verse, i) => (
        <Fragment key={'v' + i}>
          <CollapsibleVerseChords verse={verse} song={song} chordsType={chordsType} />
        </Fragment>
      ))}
    </div>
  );
};

export default SongChords;
