import {
  Accidental,
  ChordModification,
  IChord,
  IElement,
  IntervalModification,
  NoteBase,
} from '../types/song.types.ts';
import { IPianoToggleOptions, PIANO_KEYS } from './piano.types.ts'; // Obsługa akordów na klawiaturze

// Obsługa akordów na klawiaturze
// Dźwięki są notowane od c małego (0) do c dwukreślnego (25),
// Czyli jest to midi przesunięte 48

const noteBases: Record<NoteBase, number> = {
  [NoteBase.C]: 0,
  [NoteBase.D]: 2,
  [NoteBase.E]: 4,
  [NoteBase.F]: 5,
  [NoteBase.G]: 7,
  [NoteBase.A]: 9,
  [NoteBase.H]: 11,
};

const intervalOffsets: Map<number, number> = new Map([
  [1, 0],
  [2, 2],
  [3, 4],
  [4, 5],
  [5, 7],
  [6, 9],
  [7, 10],
]);

const getIntervalOffset = (element: IElement) => {
  const normalizedInterval = ((element.interval - 1) % 7) + 1;
  let interval = intervalOffsets.get(normalizedInterval)!;
  if (element.interval > 7) interval += 12;
  if (element.modification === IntervalModification.AUG) return interval + 1;
  if (element.modification === IntervalModification.DIM) return interval - 1;
  return interval;
};

export const getChordNotes = (chord: IChord) => {
  let baseNote = noteBases[chord.note.base];
  if (chord.note.accidental === Accidental.FLAT) --baseNote;
  else if (chord.note.accidental === Accidental.SHARP) ++baseNote;

  if (chord.modification === ChordModification.CLUSTER) {
    return Array.from(Array(13), (_, i) => baseNote + i);
  }

  const notes = new Set<number>();
  if (!chord.noPrime) notes.add(baseNote);

  // Na razie uproszczone (nie gramy opóźnień)
  const additionals = chord.additionals?.map((serie) => serie.elements[0]);
  // Tu tak naprawdę trzeba by było sprawdzić, czy ta 1/5 nie występuje w ciągu opóźnień, ale już bez przesady na razie
  const hasFifth = !additionals?.find((el) => el.interval === 1);
  const hasThird = !additionals?.find((el) => el.interval === 5) && hasFifth;
  const third = baseNote + (chord.minor ? 3 : 4);
  if (hasThird) notes.add(baseNote + (chord.minor ? 3 : 4));
  if (hasFifth) {
    if (chord.modification === ChordModification.AUG) notes.add(baseNote + 8);
    if (chord.modification === ChordModification.DIM) notes.add(baseNote + 6);
    else notes.add(baseNote + 7);
  }
  additionals?.forEach((el) => {
    if (el.interval !== 1 && el.interval !== 5) notes.add(baseNote + getIntervalOffset(el));
    // Akordy z kwartą raczej już nie mają tercji
    if (el.interval === 4 && !el.modification) notes.delete(third);
  });

  let baseInterval: number | undefined = undefined;
  if (chord.base?.elements.length) {
    const base = chord.base.elements[0];
    baseInterval = base.interval === 3 && !base.modification ? third : baseNote + getIntervalOffset(base);
    notes.add(baseInterval);
  }
  const notesArray = [...notes].sort((a, b) => a - b);
  if (baseInterval !== undefined) {
    const baseIndex = notesArray.indexOf(baseInterval);
    const removed = notesArray.splice(0, baseIndex);
    notesArray.push(...removed.map((n) => n + 12));
    notesArray.sort((a, b) => a - b);
    if (notesArray[0] >= 12) {
      notesArray.forEach((v, i, a) => a[i] = v - 12);
    }
  }

  return notesArray;
};

/**
 * Zwraca dźwięki akordu dla pojedynczego dźwięku według ustawień.
 */
export const getChordNotesForNote = (note: number, pianoToggleOptions: IPianoToggleOptions): number[] => {
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
  if (notes[notes.length - 1] >= PIANO_KEYS) {
    return notes.map((n) => n - 12);
  } else if (notes[0] < 0) {
    return notes.map((n) => n + 12);
  }

  return notes;
};
