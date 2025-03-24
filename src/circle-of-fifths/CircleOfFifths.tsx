import { MajorGroup, MinorGroup, NoteText } from './StyledPaths.ts';
import { Accidental, IKey, NoteBase } from '../types/song.types.ts';
import { transposeKey } from '../chords/chord-transposition.tsx';
import { noteAsString } from '../chords/chord-display.tsx';
import KeyStaff from './KeyStaff.tsx';

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

const fifths = Array.from(Array(15), (_, i) => i - 7);
const r1r2 = createPath(R1, R2);
const r1r11 = createPath(R1, R11);
const r12r2 = createPath(R12, R2);
const r3r4 = createPath(R3, R4);
const r3r31 = createPath(R3, R31);
const r32r4 = createPath(R32, R4);

const convertToKey = (fifths: number, type: Accidental, minor?: boolean): IKey => {
  return transposeKey(
    { note: { base: minor ? NoteBase.A : NoteBase.C }, minor: minor },
    { amount: fifths * 7, type: type }
  );
};

interface ICircleOfFifthsProps<Required extends boolean> {
  required?: Required;
  chosenKey: Required extends true ? IKey : IKey | undefined;
  setChosenKey: (note: Required extends true ? IKey : IKey | undefined) => void;
  letterAccidentals?: boolean;
}

const getShapeParams = (fifth: number) => {
  let minorPath = r1r2;
  let majorPath = r3r4;
  let minorRadius = (R1 + R2) / 2;
  let majorRadius = (R3 + R4) / 2;
  if (fifth >= 5) {
    minorPath = r12r2;
    majorPath = r32r4;
    minorRadius = (R12 + R2) / 2;
    majorRadius = (R32 + R4) / 2;
  } else if (fifth <= -5) {
    minorPath = r1r11;
    majorPath = r3r31;
    minorRadius = (R1 + R11) / 2;
    majorRadius = (R3 + R31) / 2;
  }
  return { minorPath, majorPath, minorRadius, majorRadius };
};

const CircleOfFifths = <Required extends boolean = false>({
  required,
  chosenKey,
  setChosenKey,
  letterAccidentals,
}: ICircleOfFifthsProps<Required>) => {
  const keyToString = (key: IKey): string => {
    return noteAsString(key.note, key.minor, { signAccidentals: !letterAccidentals });
  };

  const isChosen = (key: IKey) => {
    return (
      chosenKey &&
      chosenKey.note.base === key.note.base &&
      chosenKey.note.accidental === key.note.accidental &&
      chosenKey.minor === key.minor
    );
  };

  const handleNoteClicked = (key: IKey) => {
    if (required || !isChosen(key)) setChosenKey(key);
    else setChosenKey(undefined as unknown as IKey);
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" viewBox={`-${R4} -${R4} ${2 * R4} ${2 * R4}`} style={{ position: 'relative' }}>
        {chosenKey && <KeyStaff staffKey={chosenKey} width={50} transform="translate(-25, -100)" />}
        {fifths.map((fifth) => {
          const accidental = fifth >= 0 ? Accidental.SHARP : Accidental.FLAT;
          const minor = convertToKey(fifth, accidental, true);
          const major = convertToKey(fifth, accidental);

          const transform = `rotate(${fifth * 30})`;
          const { minorPath, majorPath, minorRadius, majorRadius } = getShapeParams(fifth);

          return (
            <g key={`f${fifth}`}>
              <MinorGroup selected={isChosen(minor)} onClick={() => handleNoteClicked(minor)}>
                <path d={minorPath} transform={transform} />
                <NoteText
                  x={x(-fifth * 30, minorRadius)}
                  y={y(-fifth * 30, minorRadius)}
                  fontSize={Math.abs(fifth) >= 5 ? 12 : 16}
                >
                  {keyToString(minor)}
                </NoteText>
              </MinorGroup>
              <MajorGroup selected={isChosen(major)} onClick={() => handleNoteClicked(major)}>
                <path d={majorPath} transform={transform} />
                <NoteText
                  x={x(-fifth * 30, majorRadius)}
                  y={y(-fifth * 30, majorRadius)}
                  fontSize={Math.abs(fifth) >= 5 ? 12 : 16}
                >
                  {keyToString(major)}
                </NoteText>
              </MajorGroup>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CircleOfFifths;
