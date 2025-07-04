import {
  Document,
  FileChild,
  ICharacterStyleOptions,
  IParagraphStyleOptions,
  ISectionOptions,
  Paragraph,
  Tab, TabStopType,
  TextRun,
  UnderlineType,
} from 'docx';
import { IChord, IChordSeries, IComplexChord, ILine, ISong, ITextRun, IVerse } from '../../types/song.types.ts';
import { personAsString } from '../../author/author.utils.ts';
import { bibleToString } from '../../song/SongInfo.tsx';
import { IMeeting, IMeetingExportDownloadedSong } from '../meeting.types.tsx';
import {
  chordAdditionalsAsString,
  chordBaseAsString,
  chordModificationAsString,
  noteAsString,
} from '../../chords/chord-display.tsx';
import { FontFamily, IFont } from '../../components/font/FontChooser.tsx';
import { IFontStyle } from '../../components/font/FontStyle.tsx';

export interface IChordRun {
  text: string;
  style?: 'sup' | 'sub';
}

const optimizeRuns = (runs: IChordRun[]): IChordRun[] => {
  if (runs.length < 2) return runs;
  const out: IChordRun[] = [runs[0]];
  for (let i = 1; i < runs.length; ++i) {
    const last = out[out.length - 1];
    const current = runs[i];
    if (last.style === current.style) {
      last.text += current.text;
    } else {
      out.push(current);
    }
  }

  return out;
};

const emToLine = (em: number) => {
  return em * 240;
};

const ptToTwip = (pt: number) => {
  return pt * 20;
};

const measureTextWidth = (text: string, font: IFont, style: IFontStyle): number => {
  const styleCss = `${style.italic ? 'italic ' : ''}${style.bold ? 'bold ' : ''}${font.fontSize}px ${font.fontFamily}`;

  const canvas =
    typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(0, 0)
      : (Object.assign(document.createElement('canvas'), { style: 'display:none' }) as HTMLCanvasElement);

  const ctx = canvas.getContext('2d')!;
  ctx.font = styleCss;

  return ctx.measureText(text).width;
};

const measureTextLineWidth = (line: ITextRun[]): number => {
  let width = 0;
  line.forEach(
    (l) =>
      (width += measureTextWidth(
        l.text,
        {
          fontFamily: FontFamily.VERDANA,
          fontSize: 9,
        },
        l.style === 1 ? { italic: true } : l.style === 2 ? { underline: true } : l.style === 3 ? { bold: true } : {}
      ))
  );
  return width;
};

const createParagraphStyles = (): IParagraphStyleOptions[] => [
  {
    id: 'SongTitle',
    name: 'Tytuł piosenki',
    next: 'Authors',
    basedOn: 'Heading1',
    run: {
      bold: true,
      font: 'Arial',
      size: '12pt',
      color: '000000',
    },
    paragraph: {
      spacing: {
        before: 0,
        after: ptToTwip(4),
      },
    },
  },
  {
    id: 'Authors',
    name: 'Autorzy',
    next: 'SongText',
    run: {
      italics: true,
      font: 'Verdana',
      size: '9pt',
      color: '7F7F7F',
    },
    paragraph: {
      spacing: {
        before: 0,
        after: ptToTwip(6),
        line: emToLine(1),
      },
    },
  },
  {
    id: 'SongContent',
    name: 'Treść piosenki',
    next: 'SongText',
    run: {
      font: 'Verdana',
      size: '9pt',
      color: '000000',
    },
    paragraph: {
      spacing: {
        before: 0,
        after: ptToTwip(6),
        line: emToLine(1.08),
      },
    },
  },
];

const createCharacterStyles = (): ICharacterStyleOptions[] => [
  {
    id: 'Special1',
    name: 'Text specjalny 1',
    basedOn: 'SongText',
    run: {
      italics: true,
      bold: false,
      underline: { type: UnderlineType.NONE },
    },
  },
  {
    id: 'Special2',
    name: 'Text specjalny 2',
    basedOn: 'SongText',
    run: {
      italics: false,
      bold: false,
      underline: { type: UnderlineType.SINGLE },
    },
  },
  {
    id: 'Special3',
    name: 'Text specjalny 3',
    basedOn: 'SongText',
    run: {
      italics: false,
      bold: true,
      underline: { type: UnderlineType.NONE },
    },
  },
  {
    id: 'Chords',
    name: 'Akordy',
    basedOn: 'SongText',
    run: {
      italics: false,
      bold: true,
      underline: { type: UnderlineType.NONE },
    },
  },
  {
    id: 'SilentChords',
    name: 'Ciche akordy',
    basedOn: 'Chords',
    run: {
      italics: true,
      bold: true,
      underline: { type: UnderlineType.NONE },
    },
  },
];

const convertTitle = (song: ISong): Paragraph =>
  new Paragraph({ style: 'SongTitle', children: [new TextRun(song.title)] });

const convertAuthors = (song: ISong): Paragraph | undefined => {
  const runs: TextRun[] = [];
  song.source && runs.push(new TextRun(song.source.map((s) => s.name).join(', ')));
  song.band && runs.push(new TextRun({ text: song.band.name, break: runs.length ? 1 : 0 }));
  song.performer?.length &&
    runs.push(
      new TextRun({
        text: `wyk. ${song.performer.map(personAsString).join(', ')}`,
        break: runs.length ? 1 : 0,
      })
    );
  if (song.lyrics?.length || song.bible?.length) {
    const lyrics: string[] = [];
    song.lyrics?.length && lyrics.push(...song.lyrics.map(personAsString));
    song.bible?.length && lyrics.push(...song.bible.map(bibleToString));
    runs.push(new TextRun({ text: `sł. ${lyrics.join(', ')}`, break: runs.length ? 1 : 0 }));
  }
  song.composer?.length &&
    runs.push(
      new TextRun({
        text: `muz. ${song.composer.map(personAsString).join(', ')}`,
        break: runs.length ? 1 : 0,
      })
    );
  song.translation?.length &&
    runs.push(
      new TextRun({
        text: `tł. ${song.translation.map(personAsString).join(', ')}`,
        break: runs.length ? 1 : 0,
      })
    );

  return new Paragraph({ style: 'Authors', children: runs });
};

const convertChordRun = (run: IChordRun, silent?: boolean): TextRun => {
  return new TextRun({
    text: run.text,
    style: silent ? 'SilentChords' : 'Chords',
    subScript: run.style === 'sub',
    superScript: run.style === 'sup',
  });
};

const convertChordRuns = (runs: IChordRun[], silent?: boolean): TextRun[] => {
  return runs.map((r) => convertChordRun(r, silent));
};

const convertSingleChord = (
  note: string,
  base?: string,
  additionalPrefix?: string,
  additional?: string
): IChordRun[] => {
  const runs: IChordRun[] = [];
  runs.push({ text: note });
  base && runs.push({ text: base, style: 'sub' });

  let add: string | undefined;
  if (additional) {
    if (additionalPrefix) add = additionalPrefix + ' ' + additional;
    else add = additional;
  } else {
    add = additionalPrefix;
  }
  add && runs.push({ text: add, style: 'sup' });

  return runs;
};

const convertChord = (chord: IChord): IChordRun[] => {
  const runs: IChordRun[] = [];

  let note = noteAsString(chord.note, chord.minor);
  let additionalsPrefix: string | undefined = undefined;

  const modification = chord.modification && chordModificationAsString(chord.modification);
  if (modification) {
    if (modification === '0') additionalsPrefix = '0';
    else note += modification;
  }

  const base = chordBaseAsString(chord);
  const additionals = chordAdditionalsAsString(chord);
  const chordsCount = Math.max(base?.length ?? 1, additionals?.length ?? 1);

  for (let i = 0; i < chordsCount; ++i) {
    if (i > 0) runs.push({ text: ' ' });
    runs.push(
      ...convertSingleChord(
        note,
        base?.[Math.min(i, (base?.length ?? 1) - 1)],
        additionalsPrefix,
        additionals?.[Math.min(i, (additionals?.length ?? 1) - 1)]
      )
    );
  }

  return runs;
};

const convertComplexChord = (complexChord: IComplexChord): IChordRun[] => {
  const runs = convertChord(complexChord.chord);
  if (complexChord.alternative) {
    runs.push({ text: ' ' });
    runs.push(...convertChord(complexChord.alternative));
  }
  return runs;
};

const convertChordSeries = (series: IChordSeries): IChordRun[] => {
  const runs: IChordRun[] = [];
  if (series.optional) runs.push({ text: '(' });
  for (let i = 0; i < series.chords.length; ++i) {
    if (i > 0) runs.push({ text: ' ' });
    runs.push(...convertComplexChord(series.chords[i]));
  }
  if (series.optional) runs.push({ text: ')' });
  if (series.repeat) runs.push({ text: '…' });

  return runs;
};

const convertChordsLine = (chords: IChordSeries[]): TextRun[] => {
  const runs: TextRun[] = [];
  for (let i = 0; i < chords.length; ++i) {
    if (i > 0) runs.push(new TextRun({ text: ' ', style: 'Chords' }));
    const series = chords[i];
    runs.push(...convertChordRuns(optimizeRuns(convertChordSeries(series)), series.silent));
  }
  return runs;
};

const convertRun = (run: ITextRun, breakBefore: boolean): TextRun => {
  return new TextRun({
    text: run.text,
    style: run.style && [1, 2, 3].includes(run.style) ? `Special${run.style}` : undefined,
    break: breakBefore ? 1 : undefined,
  });
};

const convertLineText = (runs: ITextRun[], breakBefore: boolean): TextRun[] => {
  return runs.map((run, i) => convertRun(run, !i && breakBefore));
};

const convertLine = (line: ILine, breakBefore: boolean): TextRun[] => {
  if (!line.text?.length && !line.chords) return [];
  const runs = line.text ? convertLineText(line.text, breakBefore) : [];
  if (line.chords) {
    runs.push(new TextRun({ children: [new Tab()], break: !runs.length && breakBefore ? 1 : 0}));
    runs.push(...convertChordsLine(line.chords.chords));
  }
  return runs;
};

const convertVerse = (verse: IVerse, tabPosition: number): Paragraph => {
  return new Paragraph({
    style: 'SongContent',
    indent: { start: verse.indent ? ptToTwip(20 * verse.indent) : undefined },
    tabStops: [{type: TabStopType.LEFT, position: ptToTwip(tabPosition)}],
    children: verse.lines.flatMap((line, i) => convertLine(line, !!i)),
  });
};

const convertContent = (song: ISong): Paragraph[] => {
  let maxWidth = 0;
  for (const verse of song.verses) {
    for (const line of verse.lines) {
      const width = line.text ? measureTextLineWidth(line.text) + (verse.indent ?? 0) * 20 : 0;
      if (width > maxWidth) maxWidth = width;
    }
  }

  return song.verses.map(verse => convertVerse(verse, maxWidth));
};

export const convertSong = (downloadedSong: IMeetingExportDownloadedSong): ISectionOptions => {
  const song = downloadedSong.fullSong;
  const children: FileChild[] = [convertTitle(song)];
  const authors = convertAuthors(song);
  authors && children.push(authors);
  children.push(...convertContent(song));
  return { children };
};

export const convertToDocx = (convertedSongs: ISectionOptions[], meeting: IMeeting): Document => {
  return new Document({
    styles: {
      paragraphStyles: createParagraphStyles(),
      characterStyles: createCharacterStyles(),
    },
    sections: convertedSongs,
  });
};
