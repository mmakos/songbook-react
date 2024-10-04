import { FC, Fragment } from 'react';
import { ISong } from '../../../types/song.types.ts';
import CollapsibleLineRepetition from './CollapsibleLineRepetition.tsx';
import { useAppSelector } from '../../../store/songbook.store.ts';
import { initialSongbookState } from '../../../store/songbook.reducer.ts';

interface ISongTextProps {
  song: ISong;
}

const SongRepetition: FC<ISongTextProps> = ({ song }) => {
  const {
    spacing: { repetitionSpacing },
    customSpacing,
    fontStyles: { repetition: repetitionStyle },
  } = useAppSelector((state) => state.songbookSettings.songTheme);

  return (
    <div
      style={{
        marginLeft: `${customSpacing ? repetitionSpacing : initialSongbookState.songbookSettings.songTheme.spacing.repetitionSpacing}ch`,
        fontWeight: repetitionStyle.bold ? 'bold' : 'normal',
        fontStyle: repetitionStyle.italic ? 'italic' : 'normal',
        textDecoration: repetitionStyle.underline ? 'underline' : 'none',
      }}
    >
      {song.verses.map((verse, i) => (
        <Fragment key={'v' + i}>
          <CollapsibleLineRepetition verse={verse} song={song} />
        </Fragment>
      ))}
    </div>
  );
};

export default SongRepetition;
