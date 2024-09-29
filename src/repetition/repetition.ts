import { IVerse } from '../types/song.types.ts';

export interface IRepetitionSize {
  lines: number;
  originalRepetitions?: IRepetitionSize[];
  verses: number;
  repetition?: boolean;
  repetitionEnd?: number;
}

export const calculateRepetitions = (verses: IVerse[]): IRepetitionSize[] => {
  const sizes: IRepetitionSize[][] = [];

  for (const verse of verses) {
    const verseSizes: IRepetitionSize[] = [];

    for (const line of verse.lines) {
      const last = verseSizes[verseSizes.length - 1]
      if (!last || last.repetition !== !!line.repetition || last.repetitionEnd) {
        verseSizes.push({ lines: 1, verses: 0, repetition: line.repetition });
      } else {
        last.lines += 1;
      }
      verseSizes[verseSizes.length - 1].repetitionEnd = line.repetitionEnd;
    }

    if (verse.verseRef !== undefined && verse.verseRef < sizes.length) {
      verseSizes[0].originalRepetitions = sizes[verse.verseRef];
    }

    sizes.push(verseSizes);
  }

  const result: IRepetitionSize[] = [];

  for (const i of sizes) {
    if (result.length > 0) {
      result[result.length - 1].verses += 1;
    }
    for (const j of i) {
      const last = result[result.length - 1];
      if (!last || j.originalRepetitions || last?.originalRepetitions || (j.repetition !== last.repetition) || last.repetitionEnd !== undefined) {
        result.push(j);
      } else {
        last.lines += j.lines;
        last.repetitionEnd = j.repetitionEnd;
      }
    }
  }

  return result;
};
