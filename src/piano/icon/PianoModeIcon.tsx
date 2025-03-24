import { FC } from 'react';
import { ChordMode } from '../piano.types.ts';
import BaseClef from './BaseClefIcon.tsx';
import TextButtonIcon from '../../components/icon/TextButtonIcon.tsx';

const PianoModeIcon: FC<{ mode: ChordMode }> = ({ mode }) => {
  if (mode === ChordMode.MAJOR) {
    return <TextButtonIcon>E</TextButtonIcon>;
  } else if (mode === ChordMode.MINOR) {
    return <TextButtonIcon>e</TextButtonIcon>;
  }
  return <BaseClef />;
};

export default PianoModeIcon;
