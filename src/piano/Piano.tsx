import { FC, MouseEvent, useMemo, useState } from 'react';
import { playSound } from './MidiPlayer.ts';
import { IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DeleteForever, Done, ExpandLess, Hearing, TouchApp } from '@mui/icons-material';
import { IKey } from '../types/song.types.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';
import PianoTextButtonIcon from './icon/PianoTextButtonIcon.tsx';
import InversionIcon from './icon/InversionIcon.tsx';
import PianoKey from './PianoKey.tsx';

interface IPianoProps {
  setOpen: (open: boolean) => void;
}

export interface IPianoKey {
  note: number;
  black?: boolean;
  selected?: boolean;
}

interface IPianoToggleOptions {
  touch?: boolean; // Czy klawisz trzeba trzymać
  chord?: boolean;
  minor?: boolean;
  sixth?: boolean;
  seventh?: boolean;
  inversion: number;
}

const defaultPianoToggleOptions: IPianoToggleOptions = {
  touch: true,
  chord: true,
  inversion: 0,
};

interface IPianoOptions {
  maxKeys: number; // Maksymalna liczba wciśniętych klawiszy jednocześnie
  soundLength: number;
  clear: void;
  insert: void;
  tune: IKey;
}

const isBlack = (note: number) => {
  note = note % 12;
  if (note <= 4) note += 1;
  return note % 2 === 0;
};

const getNotes = (note: number, pianoToggleOptions: IPianoToggleOptions): number[] => {
  const notes = [];
  notes.push(note);
  notes.push(note + (pianoToggleOptions.minor ? 3 : 4));
  notes.push(note + 7);
  if (pianoToggleOptions.sixth) notes.push(note + 9);
  if (pianoToggleOptions.seventh) notes.push(note + 10);
  if (pianoToggleOptions.inversion) {
    const removed = notes.splice(notes.length - pianoToggleOptions.inversion, pianoToggleOptions.inversion);
    notes.unshift(...removed.map((n) => n - 12));
  }
  if (notes[notes.length - 1] >= 25) {
    return notes.map((n) => n - 12);
  } else if (notes[0] < 0) {
    return notes.map((n) => n + 12);
  }

  return notes;
};

const pianoKeys: IPianoKey[] = Array.from(Array(25), (_, i) => ({ note: i, black: isBlack(i) }));

const Piano: FC<IPianoProps> = ({ setOpen }) => {
  const [keys, setKeys] = useState(pianoKeys);
  const [toggleOptions, setToggleOptions] = useState(defaultPianoToggleOptions);

  const toggleKeySelect = (key: IPianoKey) => {
    const notes = toggleOptions.chord ? getNotes(key.note, toggleOptions) : [key.note];
    const select = !keys[notes[0]].selected;
    notes.forEach((n) => (keys[n].selected = select));
    if (select) {
      playSound(notes.map((n) => n + 48));
    }
    setKeys([...keys]);
  };

  const clearSelection = () => {
    keys.forEach((k) => delete k.selected);
    setKeys([...keys]);
  };

  const playSelected = () => {
    playSound(keys.filter((k) => k.selected).map((k) => k.note + 48));
  };

  const handleToggleOptionsChange = (_: unknown, values: string[]) => {
    const newOptions: IPianoToggleOptions = { inversion: toggleOptions.inversion };
    values.forEach((v) => {
      if (v !== 'inversion') newOptions[v as keyof IPianoToggleOptions] = true as never;
    });
    setToggleOptions(newOptions);
  };

  const handleInversionChange = (e: MouseEvent) => {
    e.preventDefault();
    setToggleOptions({ ...toggleOptions, inversion: (toggleOptions.inversion + 1) % 3 });
  };

  const toggleValues = useMemo(() => {
    return Object.entries(toggleOptions)
      .map(([k, v]) => (v ? k : undefined))
      .filter((v) => v);
  }, [toggleOptions]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          background: 'black',
          // height: '2rem',
          borderRadius: '10px 10px 0 0',
          borderBottom: 'solid #a00',
          display: 'flex',
          gap: 3,
          padding: '10px',
        }}
      >
        <ToggleButtonGroup value={toggleValues} onChange={handleToggleOptionsChange}>
          <BasicTooltip title="Touch mode (release keys)">
            <ToggleButton value="touch">
              <TouchApp />
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title="Tryb akordów (wciśnięcie klawisza generuje cały akord)">
            <ToggleButton value="chord">
              <PianoTextButtonIcon>A</PianoTextButtonIcon>
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title="Akord molowy">
            <ToggleButton value="minor">
              <PianoTextButtonIcon style={{ fontSize: '15px' }}>Cm</PianoTextButtonIcon>
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title="Akord z septymą">
            <ToggleButton value="seventh">
              <PianoTextButtonIcon>
                A<sup>7</sup>
              </PianoTextButtonIcon>
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title="Akord z sekstą">
            <ToggleButton value="sixth">
              <PianoTextButtonIcon>
                a<sup>6</sup>
              </PianoTextButtonIcon>
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title="Przewrót akordu">
            <ToggleButton value="inversion" onClick={handleInversionChange}>
              <InversionIcon inversion={toggleOptions.inversion} />
            </ToggleButton>
          </BasicTooltip>
        </ToggleButtonGroup>
        <div style={{ alignContent: 'center', marginLeft: 'auto' }}>
          <IconButton onClick={playSelected}>
            <Hearing />
          </IconButton>
          <IconButton onClick={clearSelection}>
            <DeleteForever />
          </IconButton>
          <IconButton>
            <Done />
          </IconButton>
          <IconButton onClick={() => setOpen(false)}>
            <ExpandLess />
          </IconButton>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        {keys.map((key) => (
          <PianoKey key={key.note} pianoKey={key} touch={toggleOptions.touch} toggleKey={toggleKeySelect} />
        ))}
      </div>
    </div>
  );
};

export default Piano;
