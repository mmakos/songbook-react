import { ChosenNoteText, MajorGroup, MinorGroup, NoteText } from './StyledPaths.ts';
import { Accidental, NoteBase } from '../types/song.types.ts';
import { transposeNote } from '../chords/chord-transposition.tsx';
import { noteAsString } from '../chords/chord-display.tsx';

const R0 = 5;
const R1 = 30;
const R11 = 47;
const R12 = 48;
const R2 = 65;
const R3 = 68;
const R31 = 83;
const R32 = 84;
const R4 = 100;

/**
 * Zwraca x punktu leżący na okręgu w środku 0, 5 w kierunku angle względem północy (angle w stopniach)
 */
const x = (angle: number, radius: number, centerShift?: number) => {
  return ((centerShift ?? 0) - radius) * Math.cos(((90 - angle) / 180) * Math.PI);
};

/**
 * Zwraca y punktu leżący na okręgu w środku 0, 5 w kierunku angle względem północy (angle w stopniach)
 */
const y = (angle: number, radius: number, centerShift?: number) => {
  return ((centerShift ?? 0) - radius) * Math.sin(((90 - angle) / 180) * Math.PI) - (centerShift ?? 0);
};

const xy = (angle: number, radius: number) => {
  return `${x(angle, radius, R0)} ${y(angle, radius, R0)}`;
};

const createPath = (r1: number, r2: number) => {
  return `M ${xy(-15, r1)} A ${r1} ${r1} 0 0 0 ${xy(15, r1)} L ${xy(15, r2)} A ${r2} ${r2} 0 0 1 ${xy(-15, r2)} Z`;
};

const angles = Array.from(Array(12), (_, i) => i);
const r1r2 = createPath(R1, R2);
const r1r11 = createPath(R1, R11);
const r12r2 = createPath(R12, R2);
const r3r4 = createPath(R3, R4);
const r3r31 = createPath(R3, R31);
const r32r4 = createPath(R32, R4);

const getNote = (amount: number, type: Accidental, minor: boolean): string => {
  // Wyjątek, bo dla tego przypadku zawsze wychodzi H
  const note =
    !minor && amount === 35 && type === Accidental.FLAT
      ? {
          base: NoteBase.C,
          accidental: Accidental.FLAT,
        }
      : transposeNote({ base: minor ? NoteBase.A : NoteBase.C }, { amount, type });
  return noteAsString(note, minor, { signAccidentals: true });
};

const CircleOfFifths = () => {
  return (
    <svg width="400px" height="400px" viewBox={`-${R4} -${R4} ${2 * R4} ${2 * R4}`}>
      {angles.map((angle) => {
        const split = angle >= 5 && angle <= 7;
        const transform = `rotate(${angle * 30})`;
        return (
          <g>
            <MinorGroup>
              <path d={split ? r1r11 : r1r2} transform={transform} />
              <NoteText
                x={x(-angle * 30, (R1 + (split ? R12 : R2)) / 2)}
                y={y(-angle * 30, (R1 + (split ? R12 : R2)) / 2)}
                fontSize={split ? 12 : 16}
              >
                {getNote(angle * 7, angle > 7 ? Accidental.FLAT : Accidental.SHARP, true)}
              </NoteText>
            </MinorGroup>
            <MajorGroup>
              <path d={split ? r3r31 : r3r4} transform={transform} />
              <NoteText
                x={x(-angle * 30, (R3 + (split ? R32 : R4)) / 2)}
                y={y(-angle * 30, (R3 + (split ? R32 : R4)) / 2)}
                fontSize={split ? 12 : 16}
              >
                {getNote(angle * 7, angle > 7 ? Accidental.FLAT : Accidental.SHARP, false)}
              </NoteText>
            </MajorGroup>
            {split && (
              <>
                <MinorGroup>
                  <path d={r12r2} transform={transform} />
                  <NoteText
                    x={x(-angle * 30, ((split ? R12 : R1) + R2) / 2)}
                    y={y(-angle * 30, ((split ? R12 : R1) + R2) / 2)}
                    fontSize={12}
                  >
                    {getNote(angle * 7, Accidental.FLAT, true)}
                  </NoteText>
                </MinorGroup>
                <MajorGroup>
                  <path d={r32r4} transform={transform} />
                  <NoteText
                    x={x(-angle * 30, ((split ? R32 : R3) + R4) / 2)}
                    y={y(-angle * 30, ((split ? R32 : R3) + R4) / 2)}
                    fontSize={12}
                  >
                    {getNote(angle * 7, Accidental.FLAT, false)}
                  </NoteText>
                </MajorGroup>
              </>
            )}
          </g>
        );
      })}
      <ChosenNoteText>E♭</ChosenNoteText>
    </svg>
  );
};

export default CircleOfFifths;
