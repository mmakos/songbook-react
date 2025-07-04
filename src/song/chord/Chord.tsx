import { FC, Fragment, useMemo } from 'react';
import { IChord } from '../../types/song.types.ts';
import {
  chordAdditionalsAsString,
  chordBaseAsString,
  chordModificationAsNode,
  noteAsString,
} from '../../chords/chord-display.tsx';
import SingleChord from './SingleChord.tsx';
import { transposeNote } from '../../chords/chord-transposition.tsx';
import { useSongContext } from '../SongContext.tsx';

interface IChordProps {
  chord: IChord;
}

const Chord: FC<IChordProps> = ({ chord }) => {
  const { chordDifficulty, transposition } = useSongContext();

  const chordBase = useMemo(() => {
    if (!chordDifficulty.hideBase) return chordBaseAsString(chord, chordDifficulty);
  }, [
    chordDifficulty.hideBase,
    chordDifficulty.guitarIntervalModifications,
    chordDifficulty.hideUncommonAdditionals,
    chordDifficulty.splitSuspensions,
    chord,
  ]);

  const chordNote = useMemo(() => {
    return noteAsString(transposeNote(chord.note, transposition), chord.minor, chordDifficulty);
  }, [
    chordDifficulty.signAccidentals,
    chordDifficulty.enharmonicFlats,
    chordDifficulty.enharmonicSharps,
    chordDifficulty.americanNotation,
    transposition,
    chord,
  ]);

  const chordModification = useMemo(() => {
    if (chord.modification) return chordModificationAsNode(chord.modification, chordDifficulty);
  }, [chordDifficulty.guitarDiminishedChords, chord]);

  const chordAdditionals = useMemo(() => {
    return chordAdditionalsAsString(chord, chordDifficulty);
  }, [
    chordDifficulty.guitarIntervalModifications,
    chordDifficulty.hideUncommonAdditionals,
    chordDifficulty.splitSuspensions,
    chordDifficulty.singleAdditional,
    chordDifficulty.hideAdditionals269,
    chordDifficulty.hideFourths,
    chordDifficulty.hideUnisonAndFifth,
    chord,
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
              chordBase={chordBase?.[Math.min(i, (chordBase?.length ?? 1) - 1)]}
              chordAdditionals={chordAdditionals?.[Math.min(i, (chordAdditionals?.length ?? 1) - 1)]}
              noPrime={chord.noPrime}
            />
            {i < singleChordsLength - 1 && <>&nbsp;</>}
          </Fragment>
        ))}
    </>
  );
};

export default Chord;
