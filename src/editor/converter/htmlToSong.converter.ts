import {
  Accidental,
  ChordModification,
  IAdditionalSeries,
  IChord,
  IChords,
  IChordSeries,
  IComplexChord,
  IElement,
  ILine,
  IntervalModification,
  ITextRun,
  IVerse,
  NoteBase,
} from '../../types/song.types.ts';
import { Fragment, Node, Schema } from '@tiptap/pm/model';
import { extract } from './html.utils.ts';
import { getHTMLFromFragment } from '@tiptap/react';

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
  if (!html) return;
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

    let specialStart;
    do {
      specialStart = false;
      if (chord.startsWith('(') && !optional) {
        optional = true;
        startSeries = true;
        chord = chord.slice(1);
        specialStart = true;
      }
      if (chord.startsWith('<em>') && !silent) {
        silent = true;
        startSeries = true;
        chord = chord.slice(4);
        specialStart = true;
      }
    } while (specialStart);

    let specialEnd;
    let endOptional = false;
    let endSilent = false;
    do {
      specialEnd = false;
      if (chord.endsWith(')') && optional) {
        endOptional = true;
        endSeries = true;
        chord = chord.substring(0, chord.length - 1);
        specialEnd = true;
      }
      if (chord.endsWith('<em>') && silent) {
        endSilent = true;
        endSeries = true;
        chord = chord.substring(0, chord.length - 4);
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
    if (endOptional) optional = false;
    if (endSilent) optional = false;

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

// To wypadałoby przepisać, żeby działać normalnie na drzewie edytora, ale szczerze mówiąc trochę mi się nie chce
const parseChordCell = (cell: string): IChordSeries[][] => {
  return extract(cell.replace(/<strong>|<\/strong>|<u>|<\/u>/g, ''), '<p>', '</p>').map(parseChordLine);
};

const paragraphToText = (paragraph: Node): ITextRun[] => {
  if (!paragraph.textContent.trim()) return [];
  const runs: ITextRun[] = [];
  for (let i = 0; i < paragraph.childCount; ++i) {
    const child = paragraph.child(i);
    const run: ITextRun = { text: child.textContent };
    if (child.marks.find((m) => m.type.name === 'exclusiveItalic')) {
      run.style = 1;
    } else if (child.marks.find((m) => m.type.name === 'exclusiveUnderline')) {
      run.style = 2;
    } else if (child.marks.find((m) => m.type.name === 'exclusiveBold')) {
      run.style = 3;
    }
    runs.push(run);
  }
  if (runs.length) {
    runs[0].text = runs[0].text.trimStart();
    runs[runs.length - 1].text = runs[runs.length - 1].text.trimEnd();
  }
  return runs;
};

const cellToText = (cell: Node): ITextRun[][] => {
  const text: ITextRun[][] = [];
  for (let i = 0; i < cell.childCount; ++i) {
    text.push(paragraphToText(cell.child(i)));
  }
  return text;
};

const cellToChords = (cell: Node, schema: Schema): IChordSeries[][] => {
  const html = getHTMLFromFragment(cell.content, schema);
  return parseChordCell(html);
};

const cellToRepetitions = (cell: Node): number[] => {
  const repetitions: number[] = [];
  for (let i = 0; i < cell.childCount; ++i) {
    let rep = 0;
    const str = cell.child(i).textContent.trim();
    if (str.startsWith('|')) {
      rep = 1;
      if (str[1] === 'x' || str[1] === 'X') {
        if (str[2] === '∞') {
          rep = -1;
        } else {
          const i = +str[2];
          if (!isNaN(i) && i >= 2) rep = i;
        }
      }
      repetitions.push(rep);
    } else {
      repetitions.push(0);
    }
  }
  return repetitions;
};

const cellToComments = (cell: Node): string[] => {
  const comments: string[] = [];
  for (let i = 0; i < cell.childCount; ++i) {
    comments.push(cell.child(i).textContent.trim());
  }
  return comments;
};

const createVerseFromParts = (
  indent: number,
  text?: ITextRun[][],
  chords?: IChordSeries[][],
  altChords?: IChordSeries[][],
  repetitions?: number[],
  comments?: string[]
): IVerse | undefined => {
  if (!text && !chords) return;

  const linesCount: number = Math.max(
    text?.length ?? 0,
    chords?.length ?? 0,
    altChords?.length ?? 0,
    repetitions?.length ?? 0,
    comments?.length ?? 0
  );
  const lines: ILine[] = Array.from({ length: linesCount }, () => ({}));

  for (let i = 0; i < linesCount; ++i) {
    if (text && i < text?.length && text[i].length) lines[i].text = text[i];
    if (chords && i < chords.length && chords[i].length) {
      const c: IChords = { chords: chords[i] };
      if (altChords && i < altChords.length && altChords[i].length) c.alternatives = altChords[i];
      lines[i].chords = c;
    }
    if (repetitions && i < repetitions?.length) {
      const rep = repetitions[i];
      if (rep) {
        lines[i].repetition = true;
        if (rep !== 1) lines[i].repetitionEnd = rep;
      }
    }
    if (comments && i < comments?.length) {
      const comment = comments[i];
      if (comment.length) lines[i].comment = comment;
    }
  }

  return { lines, indent };
};

const rowToVerse = (row: Node, schema: Schema): IVerse | undefined => {
  let indent: number = 0;
  let text: ITextRun[][] | undefined = undefined;
  let chords: IChordSeries[][] | undefined = undefined;
  let altChords: IChordSeries[][] | undefined = undefined;
  let repetitions: number[] | undefined = undefined;
  let comments: string[] | undefined = undefined;

  for (let i = 0; i < row.childCount; ++i) {
    const cell = row.child(i);
    if (cell.type.name === 'tableCell' && cell.attrs.cellType) {
      const cellType = cell.attrs.cellType;
      if (cellType === 'text' && !text) {
        text = cellToText(cell);
        if (cell.attrs.indent) {
          indent = +cell.attrs.indent;
        }
      } else if (cellType === 'chord') {
        if (!chords) chords = cellToChords(cell, schema);
        else if (!altChords) altChords = cellToChords(cell, schema);
      } else if (cellType === 'repetition' && !repetitions) {
        repetitions = cellToRepetitions(cell);
      } else if (cellType === 'comment' && !comments) {
        comments = cellToComments(cell);
      }
    }
  }
  return createVerseFromParts(indent, text, chords, altChords, repetitions, comments);
};

const joinLineText = (line: ILine) => {
  return line.text?.map((t) => t.text).join() ?? '';
};

const proceedVerseRefs = (verses: IVerse[]) => {
  for (let i = 1; i < verses.length; ++i) {
    const verse = verses[i];
    if (verse.lines.length === 1) {
      let textLine = joinLineText(verse.lines[0]);
      if (textLine.endsWith('...')) textLine = textLine.slice(0, textLine.length - 3);
      else if (textLine.endsWith('…')) textLine = textLine.slice(0, textLine.length - 1);
      else continue;

      for (let j = 0; j < i; ++j) {
        const verseJ = verses[j];
        if (verseJ.indent === verse.indent && verseJ.lines.length) {
          const textLineJ = joinLineText(verseJ.lines[0]);
          if (textLineJ.startsWith(textLine) && !textLineJ.endsWith('...') && !textLineJ.endsWith('…')) {
            verse.verseRef = j;
          }
        }
      }
    }
  }
};

export const rootNodeToSong = (node: Node, schema: Schema): IVerse[] => {
  const verses: IVerse[] = [];
  for (let i = 0; i < node.childCount; ++i) {
    const child = node.child(i);
    if (child.type.name === 'songTable') {
      for (let j = 0; j < child.childCount; ++j) {
        const row = child.child(j);
        if (row.type.name == 'tableRow') {
          const verse = rowToVerse(row, schema);
          verse && verses.push(verse);
        }
      }
    }
  }
  proceedVerseRefs(verses);
  return verses;
};

export const extractChordsFromFragment = (fragment: Fragment, schema: Schema): IChordSeries[][] => {
  const html = getHTMLFromFragment(fragment, schema);
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
