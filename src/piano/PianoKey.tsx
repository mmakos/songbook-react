import { FC } from 'react';
import BlackKey from './BlackKey.ts';
import WhiteKey from './WhiteKey.ts';
import { IPianoKey } from './piano.types.ts';

interface IPianoKeyProps {
  pianoKey: IPianoKey;
  keyAction: (key: IPianoKey, pressed: boolean) => void;
  touch?: boolean;
  disabled?: boolean;
}

const PianoKey: FC<IPianoKeyProps> = ({ pianoKey, touch, keyAction, disabled }) => {
  const KeyComponent = pianoKey.black ? BlackKey : WhiteKey;

  return (
    <KeyComponent
      className={pianoKey.selected ? 'selected' : undefined}
      key={pianoKey.note}
      onMouseEnter={(e) => !disabled && e.buttons > 0 && keyAction(pianoKey, touch ? true : !pianoKey.selected)}
      onMouseDown={() => !disabled && keyAction(pianoKey, touch ? true : !pianoKey.selected)}
      onMouseUp={() => !disabled && touch && keyAction(pianoKey, false)}
      onMouseLeave={() => !disabled && touch && keyAction(pianoKey, false)}
    />
  );
};

export default PianoKey;
