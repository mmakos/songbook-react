import { FC, Fragment, useMemo } from 'react';
import { IChords, ISongContent } from '../../types/song.types.ts';
import CollapsibleVerseChords from './CollapsibleVerseChords.tsx';
import { useAppSelector } from '../../store/songbook.store.ts';
import { initialSongbookState } from '../../store/songbook.reducer.ts';

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
  const chordStyle = useAppSelector((state) => state.songbookSettings.songTheme.fontStyles.chords);
  const chordsSpacing = useAppSelector((state) => state.songbookSettings.songTheme.spacing.chordsSpacing);
  const customSpacing = useAppSelector((state) => state.songbookSettings.songTheme.customSpacing);

  const songHasChords = useMemo(() => hasChords(song, chordsType), [song, chordsType]);

  if (!songHasChords) return;

  return (
    <div
      style={{
        marginLeft: `${customSpacing ? chordsSpacing : initialSongbookState.songbookSettings.songTheme.spacing.chordsSpacing}ch`,
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
