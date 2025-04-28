import { Accidental, IKey, INote, NoteBase } from '../types/song.types.ts';

export interface ITransposition {
  amount: number;
  type?: Accidental;
}

export const transposeKey = (key: IKey, transposition: ITransposition): IKey => {
  const circleOfFifths = key.minor ? minorCircleOfFifths : majorCircleOfFifths;
  const noteIndex = getNoteIndex(key.note);
  let transposedIndex = (noteIndex + transposition.amount) % 12;
  if (transposedIndex < 0) transposedIndex += 12;

  const transposedNote = circleOfFifths[transposedIndex];
  if ('base' in transposedNote) {
    return {
      note: transposedNote,
      minor: key.minor,
    };
  }
  return {
    note:
      (transposition.type ?? transposedNote.default) == Accidental.FLAT ? transposedNote.flat : transposedNote.sharp,
    minor: key.minor,
  };
};

export const transposeNote = (note: INote, transposition: ITransposition): INote => {
  if (transposition.amount === 0) return note;
  const amount = transposition.amount % 12;
  const noteIndex = getNoteIndex(note);
  let transposedNoteIndex = (noteIndex + amount) % 12;
  if (transposedNoteIndex < 0) transposedNoteIndex += 12;
  let noteBase = notesByIndex[transposedNoteIndex];
  let accidental: Accidental | undefined;
  if (noteBase === undefined) {
    if (transposition.type === Accidental.FLAT) {
      noteBase = notesByIndex[(transposedNoteIndex + 1) % 12];
      accidental = Accidental.FLAT;
    } else {
      noteBase = notesByIndex[(transposedNoteIndex + 11) % 12];
      accidental = Accidental.SHARP;
    }
  }
  return {
    base: noteBase,
    accidental: accidental,
  };
};

export const getNoteIndex = (note: INote): number => {
  const baseNoteIndex = noteIndexes[note.base];
  if (note.accidental == Accidental.SHARP) return baseNoteIndex + 1;
  if (note.accidental == Accidental.FLAT) return baseNoteIndex - 1;
  return baseNoteIndex;
};

export const getTranspositionBetweenNotes = (original: INote, transposed: INote): ITransposition => {
  const diff = getNoteIndex(transposed) - getNoteIndex(original);
  return { amount: diff, type: transposed.accidental };
};

export const getPositionOnCircle = ({ note, minor }: IKey): number => {
  const circleOfFifths = minor ? minorCircleOfFifths : majorCircleOfFifths;
  for (let i = -7; i <= 7; ++i) {
    const shift = minor ? 21 : 12; // Dla minor 21, bo minorCircleOfFifths zaczyna się od C, a koło w 0 ma A.
    const index = (((i * 7) % 12) + shift) % 12;
    const notes = circleOfFifths[index];
    let n: INote;
    if ('base' in notes) {
      n = notes;
    } else {
      n = i >= 0 ? notes.sharp : notes.flat;
    }
    if (note.base === n.base && note.accidental === n.accidental) return i;
  }
  return 0;
};

export const noteIndexes: Record<NoteBase, number> = {
  [NoteBase.C]: 0,
  [NoteBase.D]: 2,
  [NoteBase.E]: 4,
  [NoteBase.F]: 5,
  [NoteBase.G]: 7,
  [NoteBase.A]: 9,
  [NoteBase.H]: 11,
};

export const notesByIndex: Record<number, NoteBase> = {
  0: NoteBase.C,
  2: NoteBase.D,
  4: NoteBase.E,
  5: NoteBase.F,
  7: NoteBase.G,
  9: NoteBase.A,
  11: NoteBase.H,
};

interface INoteAlternatives {
  flat: INote;
  sharp: INote;
  default?: Accidental;
}

export const majorCircleOfFifths: Array<INote | INoteAlternatives> = [
  { base: NoteBase.C },
  {
    flat: { base: NoteBase.D, accidental: Accidental.FLAT },
    sharp: { base: NoteBase.C, accidental: Accidental.SHARP },
    default: Accidental.FLAT,
  },
  { base: NoteBase.D },
  { base: NoteBase.E, accidental: Accidental.FLAT },
  { base: NoteBase.E },
  { base: NoteBase.F },
  {
    flat: { base: NoteBase.G, accidental: Accidental.FLAT },
    sharp: { base: NoteBase.F, accidental: Accidental.SHARP },
    default: Accidental.SHARP,
  },
  { base: NoteBase.G },
  { base: NoteBase.A, accidental: Accidental.FLAT },
  { base: NoteBase.A },
  { base: NoteBase.H, accidental: Accidental.FLAT },
  {
    flat: { base: NoteBase.C, accidental: Accidental.FLAT },
    sharp: { base: NoteBase.H },
    default: Accidental.SHARP,
  },
];

export const minorCircleOfFifths: Array<INote | INoteAlternatives> = [
  { base: NoteBase.C },
  { base: NoteBase.C, accidental: Accidental.SHARP },
  { base: NoteBase.D },
  {
    flat: { base: NoteBase.E, accidental: Accidental.FLAT },
    sharp: { base: NoteBase.D, accidental: Accidental.SHARP },
    default: Accidental.FLAT,
  },
  { base: NoteBase.E },
  { base: NoteBase.F },
  { base: NoteBase.F, accidental: Accidental.SHARP },
  { base: NoteBase.G },
  {
    flat: { base: NoteBase.A, accidental: Accidental.FLAT },
    sharp: { base: NoteBase.G, accidental: Accidental.SHARP },
    default: Accidental.SHARP,
  },
  { base: NoteBase.A },
  {
    flat: { base: NoteBase.H, accidental: Accidental.FLAT },
    sharp: { base: NoteBase.A, accidental: Accidental.SHARP },
    default: Accidental.FLAT,
  },
  { base: NoteBase.H },
];
