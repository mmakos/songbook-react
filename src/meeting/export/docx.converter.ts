import {
  Document,
  FileChild,
  ICharacterStyleOptions,
  IParagraphStyleOptions,
  IRunStylePropertiesOptions,
  ISectionOptions,
  Paragraph,
  ParagraphChild,
  SectionType,
  Tab,
  TabStopType,
  TextRun,
  UnderlineType,
} from 'docx';
import { IChord, IChordSeries, IComplexChord, ILine, ITextRun, IVerse } from '../../types/song.types.ts';
import { personAsString } from '../../author/author.utils.ts';
import { bibleToString } from '../../song/SongInfo.tsx';
import { IMeetingExportDownloadedSong } from '../meeting.types.tsx';
import {
  chordAdditionalsAsString,
  chordBaseAsString,
  chordModificationAsString,
  noteAsString,
} from '../../chords/chord-display.tsx';
import { IFont } from '../../components/font/FontChooser.tsx';
import { IFontStyle } from '../../components/font/FontStyle.tsx';
import { IExportMeetingContextProps } from './ExportMeetingContext.tsx';
import { emToDocxLine, ptToTwip } from '../../components/font/font.utils.ts';
import { processText } from '../../song/text/LineText.tsx';
import { IChordDifficulty } from '../../store/songbook.reducer.ts';
import { withNonBreakingSpaces } from '../../string.utils.ts';
import { ITransposition, transposeNote } from '../../chords/chord-transposition.tsx';

interface IParagraphPrototype {
  children: ParagraphChild[];
  indent?: number;
}

interface IRunPrototype {
  text: string;
  style?: 'sup' | 'sub';
}

export class DocxSongConverter {
  private readonly song: IMeetingExportDownloadedSong;
  private readonly context: IExportMeetingContextProps;
  private readonly chordDifficulty: IChordDifficulty;
  private readonly transposition: ITransposition;
  private readonly showChords: boolean;
  private maxTextWidth: number = 0;
  private currentTextWidth: number = 0;

  constructor(song: IMeetingExportDownloadedSong, context: IExportMeetingContextProps) {
    this.song = song;
    this.context = context;
    this.showChords = song.showChords ?? context.showChords;
    this.chordDifficulty = song.chordDifficulty ?? context.chordDifficulty;
    this.transposition = song.transposition ?? { amount: 0 };
  }

  static optimizeRuns(runs: IRunPrototype[]): IRunPrototype[] {
    if (runs.length < 2) return runs;
    const out: IRunPrototype[] = [runs[0]];
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
  }

  static fontStyleToRunStyle(fontStyle: IFontStyle, parentStyle?: IFontStyle): IRunStylePropertiesOptions {
    return {
      italics: parentStyle?.italic === fontStyle.italic ? undefined : !!fontStyle.italic,
      bold: parentStyle?.bold === fontStyle.bold ? undefined : !!fontStyle.bold,
      underline:
        parentStyle?.underline === fontStyle.underline
          ? undefined
          : {
              type: fontStyle.underline ? UnderlineType.SINGLE : UnderlineType.NONE,
            },
    };
  }

  getFontStyleForStyleNumber(style?: number): IFontStyle {
    const {
      fontStyles: { text, text1, text2, text3 },
    } = this.context;
    switch (style) {
      case 1:
        return text1;
      case 2:
        return text2;
      case 3:
        return text3;
      default:
        return text;
    }
  }

  static measureTextWidth(text: string, font: IFont, style: IFontStyle): number {
    const styleCss = `${style.italic ? 'italic ' : ''}${style.bold ? 'bold ' : ''}${font.fontSize}px ${font.fontFamily}`;

    const canvas: OffscreenCanvas | HTMLCanvasElement =
      typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(0, 0)
        : (Object.assign(document.createElement('canvas'), { style: 'display:none' }) as HTMLCanvasElement);

    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.font = styleCss;

    return ctx.measureText(text).width;
  }

  addTextWidth(text: string, style?: number) {
    this.currentTextWidth += DocxSongConverter.measureTextWidth(
      text,
      this.context.font,
      this.getFontStyleForStyleNumber(style)
    );
  }

  convertTitle(): Paragraph {
    return new Paragraph({ style: 'SongTitle', children: [new TextRun(this.song.fullSong.title)] });
  }

  convertAuthors(): Paragraph | undefined {
    const { excluded, inline, show } = this.context.authorsSettings;
    if (!show) return;

    const song = this.song.fullSong;
    const runs: TextRun[] = [];
    song.source &&
      !excluded.includes('source') &&
      runs.push(new TextRun(song.source.map((s) => withNonBreakingSpaces(s.name)).join(', ')));
    song.band &&
      !excluded.includes('band') &&
      runs.push(
        new TextRun({
          text: `${runs.length && inline ? ', ' : ''}${withNonBreakingSpaces(song.band.name)}`,
          break: runs.length && !inline ? 1 : 0,
        })
      );
    song.performer?.length &&
      !excluded.includes('performer') &&
      runs.push(
        new TextRun({
          text: `${runs.length && inline ? ', ' : ''}wyk.\u00a0${song.performer.map((p) => withNonBreakingSpaces(personAsString(p))).join(', ')}`,
          break: runs.length && !inline ? 1 : 0,
        })
      );
    if ((song.lyrics?.length && !excluded.includes('lyrics')) || (song.bible?.length && !excluded.includes('bible'))) {
      const lyrics: string[] = [];
      song.lyrics?.length &&
        !excluded.includes('lyrics') &&
        lyrics.push(...song.lyrics.map((p) => withNonBreakingSpaces(personAsString(p))));
      song.bible?.length &&
        !excluded.includes('bible') &&
        lyrics.push(...song.bible.map((b) => withNonBreakingSpaces(bibleToString(b))));
      runs.push(
        new TextRun({
          text: `${runs.length && inline ? ', ' : ''}sł.\u00a0${lyrics.join(', ')}`,
          break: runs.length && !inline ? 1 : 0,
        })
      );
    }
    song.composer?.length &&
      !excluded.includes('composer') &&
      runs.push(
        new TextRun({
          text: `${runs.length && inline ? ', ' : ''}muz.\u00a0${song.composer.map((p) => withNonBreakingSpaces(personAsString(p))).join(', ')}`,
          break: runs.length && !inline ? 1 : 0,
        })
      );
    song.translation?.length &&
      !excluded.includes('translation') &&
      runs.push(
        new TextRun({
          text: `${runs.length && inline ? ', ' : ''}tł.\u00a0${song.translation.map((p) => withNonBreakingSpaces(personAsString(p))).join(', ')}`,
          break: runs.length && !inline ? 1 : 0,
        })
      );

    return runs.length ? new Paragraph({ style: 'Authors', children: runs }) : undefined;
  }

  static convertChordRun(run: IRunPrototype, silent?: boolean): TextRun {
    return new TextRun({
      text: run.text,
      style: silent ? 'SilentChords' : 'Chords',
      subScript: run.style === 'sub',
      superScript: run.style === 'sup',
    });
  }

  static convertRunPrototypes(runs: IRunPrototype[], silent?: boolean): TextRun[] {
    return runs.map((r) => DocxSongConverter.convertChordRun(r, silent));
  }

  convertParagraphPrototype(paragraph: IParagraphPrototype): Paragraph {
    return new Paragraph({
      style: 'SongContent',
      indent: paragraph.indent ? { start: paragraph.indent } : undefined,
      children: paragraph.children,
      tabStops: [{ type: TabStopType.LEFT, position: ptToTwip(this.maxTextWidth) }],
    });
  }

  convertSingleChord(note: string, base?: string, additionalPrefix?: string, additional?: string): IRunPrototype[] {
    const runs: IRunPrototype[] = [];
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
  }

  convertChord(chord: IChord): IRunPrototype[] {
    const runs: IRunPrototype[] = [];

    let note = noteAsString(transposeNote(chord.note, this.transposition), chord.minor, this.chordDifficulty);
    let additionalsPrefix: string | undefined = undefined;

    const modification = chord.modification && chordModificationAsString(chord.modification, this.chordDifficulty);
    if (modification) {
      if (modification === '0') additionalsPrefix = '0';
      else note += modification;
    }

    const base = chordBaseAsString(chord, this.chordDifficulty);
    const additionals = chordAdditionalsAsString(chord, this.chordDifficulty);
    const chordsCount = Math.max(base?.length ?? 1, additionals?.length ?? 1);

    for (let i = 0; i < chordsCount; ++i) {
      if (i > 0) runs.push({ text: ' ' });
      runs.push(
        ...this.convertSingleChord(
          note,
          base?.[Math.min(i, (base?.length ?? 1) - 1)],
          additionalsPrefix,
          additionals?.[Math.min(i, (additionals?.length ?? 1) - 1)]
        )
      );
    }

    return runs;
  }

  convertComplexChord(complexChord: IComplexChord): IRunPrototype[] {
    const runs = this.convertChord(complexChord.chord);
    if (complexChord.alternative) {
      runs.push({ text: ' ' });
      runs.push(...this.convertChord(complexChord.alternative));
    }
    return runs;
  }

  convertChordSeries(series: IChordSeries): IRunPrototype[] {
    const runs: IRunPrototype[] = [];
    if (series.optional) runs.push({ text: '(' });
    for (let i = 0; i < series.chords.length; ++i) {
      if (i > 0) runs.push({ text: ' ' });
      runs.push(...this.convertComplexChord(series.chords[i]));
    }
    if (series.optional) runs.push({ text: ')' });
    if (series.repeat) runs.push({ text: '…' });

    return runs;
  }

  convertChordsLine(chords: IChordSeries[]): TextRun[] {
    const runs: TextRun[] = [];
    for (let i = 0; i < chords.length; ++i) {
      if (i > 0) runs.push(new TextRun({ text: ' ', style: 'Chords' }));
      const series = chords[i];
      runs.push(
        ...DocxSongConverter.convertRunPrototypes(
          DocxSongConverter.optimizeRuns(this.convertChordSeries(series)),
          series.silent
        )
      );
    }
    return runs;
  }

  convertRun(run: ITextRun, breakBefore: boolean, first: boolean, last: boolean): TextRun {
    const text = processText(
      run.text,
      first,
      last,
      this.context.textSettings,
      last && (run.text.endsWith('…') || run.text.endsWith('...'))
    );
    this.addTextWidth(text, run.style);
    return new TextRun({
      text,
      style: run.style && [1, 2, 3].includes(run.style) ? `Special${run.style}` : undefined,
      break: breakBefore ? 1 : undefined,
    });
  }

  convertLineText(runs: ITextRun[], breakBefore: boolean): TextRun[] {
    return runs.map((run, i) => this.convertRun(run, !i && breakBefore, i === 0, i === runs.length - 1));
  }

  convertLine(line: ILine, breakBefore: boolean, verseNumber?: number): TextRun[] {
    if (!line.text?.length && !line.chords) return [];

    const runs: TextRun[] = [];
    if (line.text?.length) {
      if (this.context.textSettings.numberVerses && verseNumber) {
        const text = `${verseNumber}. `;
        runs.push(new TextRun({ text, break: breakBefore ? 1 : undefined }));
        this.addTextWidth(text);
        breakBefore = false;
      }
      runs.push(...this.convertLineText(line.text, breakBefore));
    }

    if (line.chords && this.showChords) {
      runs.push(new TextRun({ children: [new Tab()], break: !runs.length && breakBefore ? 1 : 0 }));
      runs.push(...this.convertChordsLine(line.chords.chords));
    }

    this.maxTextWidth = Math.max(this.maxTextWidth, this.currentTextWidth);
    this.currentTextWidth = 0;

    return runs;
  }

  convertVerse(verse: IVerse, verseNumber?: number): IParagraphPrototype {
    return {
      children: verse.lines.flatMap((line, i) => {
        this.currentTextWidth += (verse.indent ?? 0) * this.context.spacing.verseIndent;
        if (this.context.textSettings.numberVerses && verseNumber && line.text?.length) {
          const l = this.convertLine(line, !!i, verseNumber);
          verseNumber = undefined;
          return l;
        } else {
          return this.convertLine(line, !!i);
        }
      }),
      indent: verse.indent ? ptToTwip(this.context.spacing.verseIndent * verse.indent) : undefined,
    };
  }

  convertContent(): Paragraph[] {
    let verseNumber = 0;
    return this.song.fullSong.verses
      .map((verse) => this.convertVerse(verse, !verse.indent ? ++verseNumber : undefined))
      .map(this.convertParagraphPrototype, this);
  }

  convertSong(): ISectionOptions {
    const children: FileChild[] = [this.convertTitle()];
    const authors = this.convertAuthors();
    authors && children.push(authors);
    children.push(...this.convertContent());
    return { children, properties: { type: SectionType.CONTINUOUS } };
  }
}

const createParagraphStyles = (context: IExportMeetingContextProps): IParagraphStyleOptions[] => [
  {
    id: 'SongTitle',
    name: 'Tytuł piosenki',
    next: 'Authors',
    basedOn: 'Heading1',
    run: {
      bold: true,
      font: 'Arial',
      size: `${Math.round((context.font.fontSize * 4) / 3)}pt`,
      color: '000000',
    },
    paragraph: {
      spacing: {
        before: 0,
        after: ptToTwip(4),
      },
    },
    quickFormat: true,
  },
  {
    id: 'Authors',
    name: 'Autorzy',
    next: 'SongContent',
    run: {
      italics: true,
      font: 'Arial',
      size: `${context.font.fontSize}pt`,
      color: '7F7F7F',
    },
    paragraph: {
      spacing: {
        before: 0,
        after: ptToTwip(6),
        line: emToDocxLine(1.15),
      },
    },
    quickFormat: true,
  },
  {
    id: 'SongContent',
    name: 'Treść piosenki',
    next: 'SongContent',
    run: {
      ...DocxSongConverter.fontStyleToRunStyle(context.fontStyles.text),
      font: context.font.fontFamily,
      size: `${context.font.fontSize}pt`,
      color: '000000',
    },
    paragraph: {
      spacing: {
        before: 0,
        after: ptToTwip(context.spacing.verseSpacing),
        line: emToDocxLine(context.spacing.lineHeight),
      },
    },
    quickFormat: true,
  },
];

const createCharacterStyles = (context: IExportMeetingContextProps): ICharacterStyleOptions[] => [
  {
    id: 'Special1',
    name: 'Tekst specjalny 1',
    basedOn: 'SongContent',
    run: DocxSongConverter.fontStyleToRunStyle(context.fontStyles.text1, context.fontStyles.text),
    quickFormat: true,
  },
  {
    id: 'Special2',
    name: 'Tekst specjalny 2',
    basedOn: 'SongContent',
    run: DocxSongConverter.fontStyleToRunStyle(context.fontStyles.text2, context.fontStyles.text),
    quickFormat: true,
  },
  {
    id: 'Special3',
    name: 'Tekst specjalny 3',
    basedOn: 'SongContent',
    run: DocxSongConverter.fontStyleToRunStyle(context.fontStyles.text3, context.fontStyles.text),
    quickFormat: true,
  },
  {
    id: 'Chords',
    name: 'Akordy',
    basedOn: 'SongContent',
    run: DocxSongConverter.fontStyleToRunStyle(context.fontStyles.chords, context.fontStyles.text),
    quickFormat: true,
  },
  {
    id: 'SilentChords',
    name: 'Ciche akordy',
    basedOn: 'SongContent',
    run: DocxSongConverter.fontStyleToRunStyle(context.fontStyles.silentChords, context.fontStyles.text),
    quickFormat: true,
  },
];

export const convertToDocx = (
  convertedSongs: ISectionOptions[],
  meetingContext: IExportMeetingContextProps
): Document => {
  return new Document({
    styles: {
      paragraphStyles: createParagraphStyles(meetingContext),
      characterStyles: createCharacterStyles(meetingContext),
    },
    sections: convertedSongs,
  });
};
