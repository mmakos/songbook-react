import { FC } from 'react';
import { ChordMode } from '../piano.types.ts';
import PianoTextButtonIcon from './PianoTextButtonIcon.tsx';
import BaseClef from './BaseClefIcon.tsx';

const PianoModeIcon: FC<{ mode: ChordMode }> = ({ mode }) => {
  if (mode === ChordMode.MAJOR) {
    return <PianoTextButtonIcon>E</PianoTextButtonIcon>;
  } else if (mode === ChordMode.MINOR) {
    return <PianoTextButtonIcon>e</PianoTextButtonIcon>
  }
  return <BaseClef />;
};

export default PianoModeIcon;
