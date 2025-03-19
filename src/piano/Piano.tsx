import { FC, MouseEvent, useMemo, useRef, useState } from 'react';
import { playSound } from './MidiPlayer.ts';
import { IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DeleteForever, Done, ExpandLess, Hearing, PlayArrow, Stop, TouchApp } from '@mui/icons-material';
import BasicTooltip from '../components/BasicTooltip.tsx';
import PianoTextButtonIcon from './icon/PianoTextButtonIcon.tsx';
import InversionIcon from './icon/InversionIcon.tsx';
import PianoKey from './PianoKey.tsx';
import { getChordNotes, getChordNotesForNote } from './chord-interpreter.ts';
import { defaultPianoToggleOptions, IPianoKey, IPianoToggleOptions, PIANO_KEYS, TInversion } from './piano.types.ts';
import { IChord } from '../types/song.types.ts';

interface IPianoProps {
  setOpen: (open: boolean) => void;
  chordsToPlayProvider?: () => IChord[] | undefined;
  chordTypedConsumer?: (chord: IChord) => void;
}

const isBlack = (note: number) => {
  note = note % 12;
  if (note <= 4) note += 1;
  return note % 2 === 0;
};

const pianoKeys: IPianoKey[] = Array.from(Array(PIANO_KEYS), (_, i) => ({ note: i, black: isBlack(i) }));

const Piano: FC<IPianoProps> = ({ setOpen, chordsToPlayProvider, chordTypedConsumer }) => {
  const [keys, setKeys] = useState(pianoKeys);
  const [toggleOptions, setToggleOptions] = useState(defaultPianoToggleOptions);
  const [playback, setPlayback] = useState(false);
  const playbackTimeoutId = useRef<number>();

  const keyAction = (key: IPianoKey, pressed: boolean) => {
    const notes = toggleOptions.chord ? getChordNotesForNote(key.note, toggleOptions) : [key.note];
    notes.forEach((n) => (keys[n].selected = pressed));
    if (pressed) {
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

  const stopPlayback = () => {
    clearTimeout(playbackTimeoutId.current);
    playbackTimeoutId.current = undefined;
    clearSelection();
    setPlayback(false);
  };

  const playChord = (chords: IChord[]) => {
    clearSelection();
    if (!chords.length) {
      setPlayback(false);
      return;
    }
    const chord = getChordNotes(chords.splice(0, 1)[0]);
    chord.forEach((n) => (keys[n].selected = true));
    setKeys([...keys]);
    playSound(chord.map((n) => n + 48));
    playbackTimeoutId.current = setTimeout(() => playChord(chords), 1000);
  };

  const playChords = () => {
    const chords = chordsToPlayProvider?.();
    if (!chords?.length) return;
    setPlayback(true);
    // const chords: IChord[] = [{ note: { base: NoteBase.F } }, { note: { base: NoteBase.C } }];
    playChord(chords);
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
    setToggleOptions({ ...toggleOptions, inversion: ((toggleOptions.inversion + 1) % 3) as TInversion });
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
          {chordsToPlayProvider && (
            <IconButton onClick={playback ? stopPlayback : playChords}>
              {playback ? <Stop /> : <PlayArrow />}
            </IconButton>
          )}
          <IconButton onClick={clearSelection}>
            <DeleteForever />
          </IconButton>
          {chordTypedConsumer && (
            <IconButton>
              <Done />
            </IconButton>
          )}
          <IconButton onClick={() => setOpen(false)}>
            <ExpandLess />
          </IconButton>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        {keys.map((key) => (
          <PianoKey
            key={key.note}
            pianoKey={key}
            touch={toggleOptions.touch}
            keyAction={keyAction}
            disabled={playback}
          />
        ))}
      </div>
    </div>
  );
};

export default Piano;
