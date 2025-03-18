import WhiteKey from './WhiteKey.ts';
import BlackKey from './BlackKey.ts';
import { useState } from 'react';
import { playSound } from './MidiPlayer.ts';

interface IPianoKey {
  note: number;
  black?: boolean;
  selected?: boolean;
}

const isBlack = (note: number) => {
  note = note % 12;
  if (note <= 4) note += 1;
  console.log(note);
  return note % 2 === 0;
};

const pianoKeys: IPianoKey[] = Array.from(Array(25), (_, i) => ({ note: i, black: isBlack(i) }));

const Piano = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const [keys, setKeys] = useState(pianoKeys);

  const toggleKeySelect = (key: IPianoKey) => {
    key.selected = !key.selected;
    playSound(key.note + 48);
    setKeys([...keys]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          background: 'black',
          height: '2rem',
          borderRadius: '10px 10px 0 0',
          borderBottom: 'solid #a00',
          display: 'flex',
          gap: 3,
          padding: '10px',
        }}
      >
        <div
          style={{ borderRadius: '50%', background: 'red', width: '10px', height: '10px' }}
          onClick={() => setOpen(false)}
        />
        <div style={{ borderRadius: '50%', background: 'blue', width: '10px', height: '10px' }} />
        <div style={{ borderRadius: '50%', background: 'green', width: '10px', height: '10px' }} />
      </div>
      <div style={{ display: 'flex' }}>
        {keys.map((key) => {
          return key.black ? (
            <BlackKey
              className={key.selected ? 'selected' : undefined}
              key={key.note}
              onClick={() => toggleKeySelect(key)}
            />
          ) : (
            <WhiteKey
              className={key.selected ? 'selected' : undefined}
              key={key.note}
              onClick={() => toggleKeySelect(key)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Piano;
