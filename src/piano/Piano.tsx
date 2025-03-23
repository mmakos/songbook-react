import { FC, useRef, useState } from 'react';
import { playSound } from './MidiPlayer.ts';
import { ToggleButton } from '@mui/material';
import { DeleteForever, Done, ExpandLess, Hearing, Speaker, Stop, TouchApp } from '@mui/icons-material';
import BasicTooltip from '../components/BasicTooltip.tsx';
import TextButtonIcon from '../components/icon/TextButtonIcon.tsx';
import InversionIcon from './icon/InversionIcon.tsx';
import PianoKey from './PianoKey.tsx';
import { getChordNotes, getChordNotesForNote } from './chord-interpreter.ts';
import { ChordMode, defaultPianoOptions, IPianoKey, PIANO_KEYS, TInversion } from './piano.types.ts';
import { IChord, NoteBase } from '../types/song.types.ts';
import PianoModeIcon from './icon/PianoModeIcon.tsx';
import StyledToggleButtonGroup, { StyledToggleButtonGroupDivider } from '../components/StyledToggleButtonGroup.tsx';
import ResizeableDiv from '../components/resizeable/ResizeableDiv.tsx';

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
  const [pianoOptions, setPianoOptions] = useState(defaultPianoOptions);
  const [playback, setPlayback] = useState(false);
  const playbackTimeoutId = useRef<number>();

  const keyAction = (key: IPianoKey, pressed: boolean) => {
    const notes = pianoOptions.chord
      ? getChordNotesForNote(key.note, pianoOptions, { note: { base: NoteBase.A }, minor: true })
      : [key.note];
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

  return (
    <ResizeableDiv minWidth={500} maxWidth={10000} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
        <StyledToggleButtonGroup size="small">
          <BasicTooltip title="Tryb gry (puszczanie klawiszy)">
            <ToggleButton
              value="touch"
              selected={pianoOptions.touch}
              onClick={() => setPianoOptions({ ...pianoOptions, touch: !pianoOptions.touch })}
            >
              <TouchApp />
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title="Tryb gry akordami (wciśnięcie klawisza generuje cały akord)">
            <ToggleButton
              value="chord"
              selected={pianoOptions.chord}
              onClick={() => setPianoOptions({ ...pianoOptions, chord: !pianoOptions.chord })}
            >
              <TextButtonIcon>A</TextButtonIcon>
            </ToggleButton>
          </BasicTooltip>
        </StyledToggleButtonGroup>
        <StyledToggleButtonGroupDivider />
        <StyledToggleButtonGroup size="small">
          <BasicTooltip title="Tryb akordów (akordy zgodnie z ustawioną tonacją / dur / moll)">
            <ToggleButton
              value="mode"
              selected={pianoOptions.mode !== ChordMode.KEY}
              onClick={() => setPianoOptions({ ...pianoOptions, mode: (pianoOptions.mode + 1) % 3 })}
            >
              <PianoModeIcon mode={pianoOptions.mode} />
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title="Akord z septymą">
            <ToggleButton
              value="seventh"
              selected={pianoOptions.seventh}
              onClick={() => setPianoOptions({ ...pianoOptions, seventh: !pianoOptions.seventh })}
            >
              <TextButtonIcon>
                A<sup>7</sup>
              </TextButtonIcon>
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title="Akord z sekstą">
            <ToggleButton
              value="sixth"
              selected={pianoOptions.sixth}
              onClick={() => setPianoOptions({ ...pianoOptions, sixth: !pianoOptions.sixth })}
            >
              <TextButtonIcon>
                a<sup>6</sup>
              </TextButtonIcon>
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip
            title={`Przewrót akordu (${pianoOptions.inversion ? `${pianoOptions.inversion} przewrót` : 'bez przewrotu'})`}
          >
            <ToggleButton
              value="inversion"
              selected={pianoOptions.inversion !== 0}
              onClick={() =>
                setPianoOptions({
                  ...pianoOptions,
                  inversion: ((pianoOptions.inversion + 1) % 3) as TInversion,
                })
              }
            >
              <InversionIcon inversion={pianoOptions.inversion} />
            </ToggleButton>
          </BasicTooltip>
        </StyledToggleButtonGroup>
        <div style={{ alignContent: 'center', marginLeft: 'auto' }}>
          <StyledToggleButtonGroup size="small">
            <ToggleButton value="hearing" onClick={playSelected}>
              <Hearing />
            </ToggleButton>
            {chordsToPlayProvider && (
              <ToggleButton value="playback" selected={playback} onClick={playback ? stopPlayback : playChords}>
                {playback ? <Stop /> : <Speaker />}
              </ToggleButton>
            )}
            <ToggleButton value="delete" onClick={clearSelection}>
              <DeleteForever />
            </ToggleButton>
            {chordTypedConsumer && (
              <ToggleButton value="done">
                <Done />
              </ToggleButton>
            )}
            <ToggleButton value="hide" onClick={() => setOpen(false)}>
              <ExpandLess />
            </ToggleButton>
          </StyledToggleButtonGroup>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        {keys.map((key) => (
          <PianoKey
            key={key.note}
            pianoKey={key}
            touch={pianoOptions.touch}
            keyAction={keyAction}
            disabled={playback}
          />
        ))}
      </div>
    </ResizeableDiv>
  );
};

export default Piano;
