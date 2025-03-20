import {
  Accidental,
  ChordModification,
  IAdditionalSeries,
  IChord,
  IChordSeries,
  IComplexChord,
  IElement,
  IntervalModification,
  NoteBase,
} from '../../types/song.types.ts';
import { extract } from './html.utils.ts';

const parseIntervalModification = (str: string): [string, IntervalModification | undefined] => {
  if (str.startsWith('&lt;')) return [str.slice(4), IntervalModification.AUG];
  if (str.startsWith('&gt;')) return [str.slice(4), IntervalModification.DIM];
  if (str.startsWith('+')) return [str.slice(1), IntervalModification.AUG];
  if (str.startsWith('-')) return [str.slice(1), IntervalModification.DIM];

  return [str, undefined];
};

const parseChordModification = (str: string): [string, ChordModification | undefined] => {
  if (str.startsWith('&lt;')) return [str.slice(4), ChordModification.AUG];
  if (str.startsWith('&gt;')) return [str.slice(4), ChordModification.DIM];
  if (str.startsWith('+')) return [str.slice(1), ChordModification.AUG];
  if (str.startsWith('<sup>0</sup>')) return [str.slice(12), ChordModification.DIM];
  if (str.startsWith('*')) return [str.slice(1), ChordModification.CLUSTER];

  return [str, undefined];
};

const parseElement = (str: string): IElement | undefined => {
  const interval = +str[0];
  // Niepoprawny składnik w basie '${interval}'
  if (isNaN(interval) || interval < 1 || interval > 13) return;

  const element: IElement = {
    interval: interval,
  };
  const [, modification] = parseIntervalModification(str.slice(1));
  if (modification) {
    element.modification = modification;
  }
  return element;
};

const parseAdditionalSeries = (str: string): IAdditionalSeries | undefined => {
  const additionalSeries: IAdditionalSeries = { elements: [] };
  if (str.startsWith('(')) {
    additionalSeries.optional = true;
    str = str.slice(1);
    if (str.endsWith(')')) str = str.slice(0, str.length - 1);
  }
  const elements = str
    .split(/-(?!-)/)
    .map(parseElement)
    .filter((e) => !!e);
  if (elements.length) additionalSeries.elements = elements;
  return additionalSeries.elements.length ? additionalSeries : undefined;
};

const parseAdditionals = (html: string, chord: IChord) => {
  if (html.startsWith('<sup>')) {
    html = html.slice(5);
    const supEnd = html.indexOf('</sup>');
    if (supEnd >= 0) {
      const additionals = html
        .slice(0, supEnd)
        .split(' ')
        .map(parseAdditionalSeries)
        .filter((a) => !!a);
      if (additionals.length) {
        chord.additionals = additionals;
      }
    }
  }
};

const parseNoPrime = (html: string, chord: IChord): string => {
  if (html.startsWith('<strike>1</strike>')) {
    chord.noPrime = true;
    html = html.slice(18).trimStart();
  }
  return html;
};

const parseBase = (html: string, chord: IChord): string => {
  if (html.startsWith('<sub>')) {
    html = html.slice(5);
    const subEnd = html.indexOf('</sub>');
    if (subEnd >= 0) {
      const base = html.slice(0, subEnd);
      html = html.slice(subEnd + 6);
      html = parseNoPrime(html, chord);

      if (base.length) chord.base = parseAdditionalSeries(base);
    }
  }
  return html;
};

const parseModification = (html: string, chord: IChord): string => {
  const [slicedHtml, modification] = parseChordModification(html);
  if (modification) {
    chord.modification = modification;
  }
  return slicedHtml;
};

const parseAccidental = (html: string, chord: IChord): string => {
  if (html.startsWith('es')) {
    chord.note.accidental = Accidental.FLAT;
    return html.slice(2);
  }
  if (html.startsWith('is')) {
    chord.note.accidental = Accidental.SHARP;
    return html.slice(2);
  }
  if (html.startsWith('s') || html.startsWith('b') || html.startsWith('♭')) {
    chord.note.accidental = Accidental.FLAT;
    return html.slice(1);
  }
  if (html.startsWith('#') || html.startsWith('♯')) {
    chord.note.accidental = Accidental.SHARP;
    return html.slice(1);
  }
  return html;
};

const parseSimpleChord = (html: string): IChord | undefined => {
  const note = html[0];
  let normalizedNote = note.toUpperCase();
  html = html.slice(1);
  if (normalizedNote === 'B') {
    normalizedNote = 'H';
  }
  // Niepoprawna podstawa akordu '${note}': możliwe jedynie: C, D, E, F, G, A, B, H
  if (!Object.values(NoteBase).includes(normalizedNote as NoteBase)) return;

  const chord: IChord = { note: { base: normalizedNote as NoteBase } };

  const upperNote = note.toUpperCase();
  if (upperNote !== note) chord.minor = true;

  if (upperNote === 'B') chord.note.accidental = Accidental.FLAT;
  else html = parseAccidental(html, chord);

  html = parseModification(html, chord);
  html = parseBase(html, chord);
  parseAdditionals(html, chord);

  return chord;
};

const parseChord = (html: string): IComplexChord | undefined => {
  const chords = html.split(/(?<!<)\//, 2);
  const simple = parseSimpleChord(chords[0]);
  if (!simple) return;
  const chord: IComplexChord = { chord: simple };
  if (chords.length > 1) chord.alternative = parseSimpleChord(chords[1]);
  return chord;
};

const parseChordsSeries = (chords: string[], silent?: boolean, optional?: boolean, repeat?: boolean): IChordSeries => {
  return {
    chords: chords.map(parseChord).filter((c) => !!c),
    optional: optional,
    silent: silent,
    repeat: repeat,
  };
};

interface IStrChordSeries {
  chords: string[];
  optional?: boolean;
  silent?: boolean;
  repeat?: boolean;
}

/**
 * Funkcja przestawia końcowe tagi z początków akordów na koniec poprzedniego akordu
 * np. ["A<sup>7", "</sup>d"] - może to często wystąpić, jak ktoś da spację przed wyjściem z <sup>
 */
const fixUpChordSpaces = (chords: string[]) => {
  for (let i = 0; i < chords.length; ++i) {
    chords[i] = chords[i].trim();
  }
  for (let i = chords.length - 1; i > 0; --i) {
    let chord = chords[i];
    while (chord.startsWith('</')) {
      const start = chord.indexOf('>') + 1;
      if (start) {
        chord = '';
      } else {
        const tag = chord.slice(0, start);
        chords[i - 1] += tag;
        chord = chord.slice(start);
      }
    }
    if (chord.length) chords[i] = chord;
    else chords.splice(i, 1);
  }
};

const parseChordLine = (line: string): IChordSeries[] => {
  const chords = line.split(/ +(?!\d)/);
  fixUpChordSpaces(chords);
  const series: IStrChordSeries[] = [{ chords: [] }];
  let optional = false;
  let silent = false;
  for (const el of chords) {
    let chord = el;
    let startSeries = false;
    let endSeries = false;
    let repeat = false;

    let specialStart = false;
    do {
      if (chord.startsWith('(') && !optional) {
        optional = true;
        startSeries = true;
        chord = chord.slice(1);
        specialStart = true;
      }
      if (chord.startsWith('<i>') && !silent) {
        silent = true;
        startSeries = true;
        chord = chord.slice(1);
        specialStart = true;
      }
    } while (specialStart);

    let specialEnd = false;
    do {
      if (chord.endsWith(')') && optional) {
        optional = false;
        endSeries = true;
        chord = chord.substring(0, chord.length - 1);
        specialEnd = true;
      }
      if (chord.endsWith('<i>') && silent) {
        silent = false;
        endSeries = true;
        chord = chord.substring(0, chord.length - 3);
        specialEnd = true;
      }
      if (chord.endsWith('…')) {
        repeat = true;
        endSeries = true;
        chord = chord.substring(0, chord.length - 1);
        specialEnd = true;
      }
    } while (specialEnd);

    let last = series[series.length - 1];
    if (startSeries) {
      if (last.chords.length) {
        last = { chords: [], silent: silent, optional: optional };
        series.push(last);
      } else {
        last.silent = silent;
        last.optional = optional;
      }
    }
    last.chords.push(chord);
    if (endSeries) {
      if (repeat) series[series.length - 1].repeat = true;
      series.push({ chords: [] });
    }
  }
  return series
    .filter((s) => s.chords.length)
    .map((s) => parseChordsSeries(s.chords, s.silent, s.optional, s.repeat))
    .filter((s) => !!s.chords.length);
};

export const parseChordCell = (cell: string): IChordSeries[][] => {
  return extract(cell.replace(/<strong>|<\/strong>|<u>|<\/u>/g, ''), '<p>', '</p>').map(parseChordLine);
};

export const extractChordsFromFragment = (html: string): IChordSeries[][] => {
  const cells = extract(html, 'cell-type="chord">', '</td>');

  return cells.flatMap(parseChordCell);
};

export const flattenChords = (lines: IChordSeries[][]): IChord[] => {
  const chords: IChord[] = [];
  for (const line of lines) {
    for (const series of line) {
      for (const complex of series.chords) {
        chords.push(complex.chord);
      }
    }
  }
  return chords;
};
