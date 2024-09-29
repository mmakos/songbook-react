import { IVerse } from '../../types/song.types.ts';
import { FC, Fragment } from 'react';
import CollapsibleSingleRepetition from './CollapsibleSingleRepetition.tsx';
import { calculateRepetitions } from '../../repetition/repetition.ts';
import { useAppSelector } from '../../store/songbook.store.ts';
import { initialSongbookState } from '../../store/songbook.reducer.ts';

interface IRepetitionProps {
  verses: IVerse[];
}

const SongRepetition: FC<IRepetitionProps> = ({ verses }) => {
  const repetitionStyle = useAppSelector((state) => state.songbookSettings.songTheme.fontStyles.repetition);
  const repetitionSpacing = useAppSelector((state) => state.songbookSettings.songTheme.spacing.repetitionSpacing);
  const customSpacing = useAppSelector((state) => state.songbookSettings.songTheme.customSpacing);
  const sizes = calculateRepetitions(verses);

  if (sizes.length <= 1 && !sizes[0]?.repetition) return undefined;

  return (
    <div
      style={{
        marginLeft: `${customSpacing ? repetitionSpacing : initialSongbookState.songbookSettings.songTheme.spacing.repetitionSpacing}ch`,
        display: 'flex',
        flexDirection: 'column',
        fontWeight: repetitionStyle.bold ? 'bold' : 'normal',
        fontStyle: repetitionStyle.italic ? 'italic' : 'normal',
        textDecoration: repetitionStyle.underline ? 'underline' : 'none',
      }}
    >
      {sizes.map((size, i) => (
        <Fragment key={'s' + i}>
          <CollapsibleSingleRepetition {...size} />
        </Fragment>
      ))}
    </div>
  );
};

export default SongRepetition;
