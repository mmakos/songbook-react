import { FC } from 'react';
import { IComplexChord } from '../../types/song.types.ts';
import Chord from './Chord.tsx';
import { useAppSelector } from '../../store/songbook.store.ts';

interface IComplexChordProps {
  chord: IComplexChord;
}

const ComplexChord: FC<IComplexChordProps> = ({ chord }) => {
  const hideAlternatives = useAppSelector((state) => state.songSettings.chordDifficulty.hideAlternatives);

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
