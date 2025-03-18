import { IPianoKey } from './Piano.tsx';
import { FC } from 'react';
import BlackKey from './BlackKey.ts';
import WhiteKey from './WhiteKey.ts';

interface IPianoKeyProps {
  pianoKey: IPianoKey;
  touch?: boolean;
  toggleKey: (key: IPianoKey) => void;
}

const PianoKey: FC<IPianoKeyProps> = ({ pianoKey, touch, toggleKey }) => {
  const KeyComponent = pianoKey.black ? BlackKey : WhiteKey;

  return (
    <KeyComponent
      className={pianoKey.selected ? 'selected' : undefined}
      key={pianoKey.note}
      onMouseEnter={(e) => e.buttons > 0 && toggleKey(pianoKey)}
      onMouseDown={() => toggleKey(pianoKey)}
      onMouseUp={() => pianoKey.selected && touch && toggleKey(pianoKey)} // TODO trzeba tu przekazywać bool jeszcze
      onMouseLeave={() => pianoKey.selected && touch && toggleKey(pianoKey)}
    />
  );
};

export default PianoKey;
