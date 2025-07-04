import { FC } from 'react';
import { IComplexChord } from '../../types/song.types.ts';
import Chord from './Chord.tsx';
import { useSongContext } from '../SongContext.tsx';

interface IComplexChordProps {
  chord: IComplexChord;
}

const ComplexChord: FC<IComplexChordProps> = ({ chord }) => {
  const {
    chordDifficulty: { hideAlternatives },
  } = useSongContext();

  return (
    <>
      <Chord chord={chord.chord} />
      {chord.alternative && !hideAlternatives && (
        <>
          /<Chord chord={chord.alternative} />
        </>
      )}
    </>
  );
};

export default ComplexChord;
