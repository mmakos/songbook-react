import { FC, Fragment, useMemo } from 'react';
import { IChord } from '../../types/song.types.ts';
import {
  chordAdditionalsAsString,
  chordBaseAsString,
  chordModificationAsString,
  chordNoteAsString,
} from '../../chords/chord-display.tsx';
import { useAppSelector } from '../../store/songbook.store.ts';
import SingleChord from './SingleChord.tsx';

interface IChordProps {
  chord: IChord;
}

const Chord: FC<IChordProps> = ({ chord }) => {
  const chordDifficulty = useAppSelector((state) => state.songSettings.chordDifficulty);

  const chordBase = useMemo(() => {
    if (!chordDifficulty.hideBase) return chordBaseAsString(chord, chordDifficulty);
  }, [
    chordDifficulty.hideBase,
    chordDifficulty.guitarIntervalModifications,
    chordDifficulty.hideUncommonAdditionals,
    chordDifficulty.splitSuspensions,
  ]);

  const chordNote = useMemo(() => {
    return chordNoteAsString(chord, chordDifficulty);
  }, [chordDifficulty.signAccidentals]);

  const chordModification = useMemo(() => {
    if (chord.modification) return chordModificationAsString(chord.modification, chordDifficulty);
  }, [chordDifficulty.guitarDiminishedChords]);

  const chordAdditionals = useMemo(() => {
    return chordAdditionalsAsString(chord, chordDifficulty);
  }, [
    chordDifficulty.guitarIntervalModifications,
    chordDifficulty.hideUncommonAdditionals,
    chordDifficulty.splitSuspensions,
    chordDifficulty.singleAdditional
  ]);

  if ((!chordBase || chordBase.length <= 1) && (!chordAdditionals || chordAdditionals.length <= 1)) {
    return (
      <SingleChord
        chordNote={chordNote}
        chordModification={chordModification}
        chordBase={chordBase?.[0]}
        chordAdditionals={chordAdditionals?.[0]}
        noPrime={chord.noPrime}
      />
    );
  }

  const singleChordsLength = Math.max(chordBase?.length ?? 0, chordAdditionals?.length ?? 0);
  return (
    <>
      {Array(singleChordsLength)
        .fill(undefined)
        .map((_, i) => (
          <Fragment key={'c' + i}>
            <SingleChord
              chordNote={chordNote}
              chordModification={chordModification}
              chordBase={chordBase?.[Math.min(i, chordBase?.length ?? 0)]}
              chordAdditionals={chordAdditionals?.[Math.min(i, chordAdditionals?.length ?? 0)]}
              noPrime={chord.noPrime}
            />
            {i < singleChordsLength - 1 && <>&nbsp;</>}
          </Fragment>
        ))}
    </>
  );
};

export default Chord;
