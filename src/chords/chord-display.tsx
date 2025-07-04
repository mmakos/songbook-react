import {
  Accidental,
  ChordModification,
  IAdditionalSeries,
  IChord,
  IElement,
  IKey,
  INote,
  IntervalModification,
  NoteBase,
} from '../types/song.types.ts';
import { IChordDifficulty } from '../store/songbook.reducer.ts';
import { ReactNode } from 'react';
import { noteIndexes, notesByIndex } from './chord-transposition.tsx';

type THidableInterval = 'prime' | 'triad';

export const keyAsString = (key: IKey): string => {
  return noteAsString(key.note, key.minor) + (key.minor ? '-moll' : '-dur');
};

export const chordBaseAsString = (chord: IChord, chordDifficulty?: IChordDifficulty): string[] | undefined => {
  if (chord.base) {
    return additionalSeriesAsString(chord.base, chordDifficulty, 'prime');
  }
};

export const chordAdditionalsAsString = (chord: IChord, chordDifficulty?: IChordDifficulty): string[] | undefined => {
  if (chord.additionals && chord.additionals.length > 0) {
    if (chordDifficulty?.singleAdditional || chord.additionals.length == 1) {
      if (
        chordDifficulty?.singleAdditional &&
        chordDifficulty?.guitarDiminishedChords &&
        chord.modification == ChordModification.DIM
      ) {
        return;
      }
      const lastAdditionals = chord.additionals[chord.additionals.length - 1];
      if (
        chordDifficulty?.hideUnisonAndFifth &&
        lastAdditionals.elements.length === 1 &&
        !lastAdditionals.elements[0].modification &&
        (lastAdditionals.elements[0].interval === 1 || lastAdditionals.elements[0].interval === 5)
      ) {
        return;
      }
      const hide = chord.additionals[0].elements.length > 1 ? 'triad' : undefined;
      return additionalSeriesAsString(lastAdditionals, chordDifficulty, hide);
    }
    const additionalsStr: string[][] = chord.additionals.reduce((array, element) => {
      const add = additionalSeriesAsString(element, chordDifficulty, 'triad');
      add && array.push(add);
      return array;
    }, [] as string[][]);

    if (additionalsStr.length == 0) return;
    if (additionalsStr.length == 1) return additionalsStr[0];

    if (chordDifficulty?.splitSuspensions) {
      const maxSuspensions = additionalsStr.reduce((max, value) => Math.max(value.length, max), 0);
      const result: string[] = Array(maxSuspensions).fill('');
      for (let i = 0; i < maxSuspensions; ++i) {
        for (const element of additionalsStr) {
          const add = element;
          const interval = add[Math.min(i, add.length)];
          if (interval !== '1' && interval !== '3' && interval !== '5') {
            result[i] += add[Math.min(i, add.length - 1)];
          }
        }
      }
      return result;
    } else {
      let result = additionalsStr[0][0];
      for (let i = 1; i < additionalsStr.length; ++i) {
        if (additionalsStr[i - 1][0].includes('-') || additionalsStr[i][0].includes('-')) {
          result += ' ';
        }
        result += additionalsStr[i][0];
      }
      return [result];
    }
  }
};

export const chordModificationAsString = (
  modification: ChordModification,
  chordDifficulty?: IChordDifficulty
): string => {
  switch (modification) {
    case ChordModification.AUG:
      return chordDifficulty?.guitarDiminishedChords ? '+' : '<';
    case ChordModification.DIM:
      return chordDifficulty?.guitarDiminishedChords ? '0' : '>';
    case ChordModification.CLUSTER:
      return '*';
  }
};

export const chordModificationAsNode = (
  modification: ChordModification,
  chordDifficulty?: IChordDifficulty
): ReactNode => {
  const str = chordModificationAsString(modification, chordDifficulty);
  return str === '0' ? <sup>0</sup> : str;
};

const accidentalAsString = (accidental: Accidental, noteBase: NoteBase, chordDifficulty?: IChordDifficulty): string => {
  if (accidental == Accidental.SHARP) {
    return chordDifficulty?.signAccidentals ? '♯' : 'is';
  }
  if (accidental == Accidental.FLAT) {
    if (chordDifficulty?.signAccidentals) return '♭';
    return noteBase == NoteBase.A || noteBase == NoteBase.E ? 's' : 'es';
  }
  return '';
};

export const noteAsString = (note: INote, minor?: boolean, chordDifficulty?: IChordDifficulty): string => {
  note = replaceEnharmonicFlatIfNeeded(note, chordDifficulty);
  note = replaceEnharmonicSharpIfNeeded(note, chordDifficulty);
  const noteBase: NoteBase = note.base;
  let accidental = note.accidental;
  let chordNote: string;

  // Wyjątek dla notacji niemieckiej (zamiast B jest H, A zamiast Bb (b-flat) jest B)
  if (noteBase == NoteBase.H && (chordDifficulty?.americanNotation || accidental == Accidental.FLAT)) {
    chordNote = minor ? 'b' : 'B';
    if (!chordDifficulty?.americanNotation) {
      accidental = undefined;
    }
  } else {
    chordNote = minor ? noteBase.toLowerCase() : noteBase;
  }
  if (accidental) {
    chordNote = chordNote + accidentalAsString(accidental, noteBase, chordDifficulty);
  }

  return chordNote;
};

const replaceEnharmonicFlatIfNeeded = (note: INote, chordDifficulty?: IChordDifficulty): INote => {
  if (!chordDifficulty?.enharmonicFlats || note.accidental !== Accidental.FLAT) return note;
  if (note.base === NoteBase.H && !chordDifficulty?.americanNotation) return note;
  const noteIndex = (noteIndexes[note.base] + 10) % 12;
  const lowerNote = notesByIndex[noteIndex];
  if (lowerNote) {
    return { base: lowerNote, accidental: Accidental.SHARP };
  } else {
    return { base: notesByIndex[(noteIndex + 1) % 12] };
  }
};

const replaceEnharmonicSharpIfNeeded = (note: INote, chordDifficulty?: IChordDifficulty): INote => {
  if (!chordDifficulty?.enharmonicSharps || note.accidental !== Accidental.SHARP) return note;
  if (note.base === NoteBase.E) return { base: NoteBase.F };
  if (note.base === NoteBase.H) return { base: NoteBase.C };
  if (note.base === NoteBase.A && !chordDifficulty.americanNotation) {
    return { base: NoteBase.H, accidental: Accidental.FLAT };
  }
  return note;
};

const intervalModificationAsString = (
  modification: IntervalModification,
  chordDifficulty?: IChordDifficulty
): string => {
  if (modification == IntervalModification.AUG) {
    return chordDifficulty?.guitarIntervalModifications ? '+' : '<';
  }
  if (modification == IntervalModification.DIM) {
    return chordDifficulty?.guitarIntervalModifications ? '-' : '>';
  }
  return '';
};

const elementAsString = (element: IElement, chordDifficulty?: IChordDifficulty): string => {
  let elString: string = element.interval + '';
  if (element.modification) {
    elString += intervalModificationAsString(element.modification, chordDifficulty);
  }

  return elString;
};

const emptyIfTriadsInterval = (interval: string, hidableInterval: THidableInterval): string => {
  if (interval === '1' || interval === '8' || (hidableInterval === 'triad' && (interval === '3' || interval === '5'))) {
    return '';
  }
  return interval;
};

const mapAdditionalElement = (element: IElement, difficulty?: IChordDifficulty): string | undefined => {
  if (difficulty?.hideAdditionals269 && (element.interval === 2 || element.interval === 6 || element.interval === 9)) {
    return;
  }
  if (difficulty?.hideFourths && element.interval === 4) return;
  if (difficulty?.hideUncommonAdditionals && element.modification) return;

  return elementAsString(element, difficulty);
};

const additionalSeriesAsString = (
  series: IAdditionalSeries,
  chordDifficulty?: IChordDifficulty,
  hideInterval?: THidableInterval
): string[] | undefined => {
  if (series.elements.length > 0) {
    const seriesStrings: Array<string | undefined> = series.elements.map((element) =>
      mapAdditionalElement(element, chordDifficulty)
    );
    if (seriesStrings.includes(undefined)) return undefined;

    let result = seriesStrings as string[];
    if (!chordDifficulty?.splitSuspensions) {
      result = [seriesStrings.join('-')];
    } else if (hideInterval) {
      result = result.map((value) => emptyIfTriadsInterval(value, hideInterval));
    }
    if (series.optional) {
      result = result.map((s) => (s !== '' ? '(' + s + ')' : s));
    }

    return result;
  }
};
