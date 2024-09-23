import { FC, ReactNode, useMemo } from 'react';
import { useAppSelector } from '../../store/songbook.store.ts';
import { useTheme } from '@mui/material';

interface ISingleChordProps {
  chordNote: string;
  chordModification: ReactNode;
  chordBase?: string;
  chordAdditionals?: string;
}

const SingleChord: FC<ISingleChordProps> = ({ chordNote, chordModification, chordBase, chordAdditionals }) => {
  const hideBaseAdditional = useAppSelector((state) => state.songSettings.chordDifficulty.hideBaseAdditional);

  return (
    <>
      {chordNote}
      {chordModification}
      {chordBase && <sub>{chordBase}</sub>}
      {chordAdditionals && (!hideBaseAdditional || chordAdditionals !== chordBase) && <sup>{chordAdditionals}</sup>}
    </>
  );
};

export default SingleChord;
