import { FC, Fragment } from 'react';
import { ISong } from '../../types/song.types.ts';
import CollapsibleVerseChords from './CollapsibleVerseChords.tsx';
import { useAppSelector } from '../../store/songbook.store.ts';
import { initialSongbookState } from '../../store/songbook.reducer.ts';

interface ISongChordsProps {
  song: ISong;
}

const SongChords: FC<ISongChordsProps> = ({ song }) => {
  const chordStyle = useAppSelector((state) => state.songbookSettings.songTheme.fontStyles.chords);
  const chordsSpacing = useAppSelector((state) => state.songbookSettings.songTheme.spacing.chordsSpacing);
  const customSpacing = useAppSelector((state) => state.songbookSettings.songTheme.customSpacing);

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
          <CollapsibleVerseChords verse={verse} song={song} />
        </Fragment>
      ))}
    </div>
  );
};

export default SongChords;
