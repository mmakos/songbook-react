import { FC, ReactNode } from 'react';
import { useAppSelector } from '../../store/songbook.store.ts';

interface ISingleChordProps {
  chordNote: string;
  chordModification: ReactNode;
  chordBase?: string;
  chordAdditionals?: string;
  noPrime?: boolean;
}

const SingleChord: FC<ISingleChordProps> = ({ chordNote, chordModification, chordBase, chordAdditionals, noPrime }) => {
  const hideBaseAdditional = useAppSelector((state) => state.songSettings.chordDifficulty.hideBaseAdditional);

  return (
    <>
      {chordNote}
      {chordModification}
      {noPrime && <sub><s>1</s></sub>}
      {chordBase && <sub>{chordBase}</sub>}
      {chordAdditionals && (!hideBaseAdditional || chordAdditionals !== chordBase) && <sup>{chordAdditionals}</sup>}
    </>
  );
};

export default SingleChord;
