// import { IVerse } from '../types/song.types.ts';
//
// export interface IRepetitionSize {
//   lines: number;
//   verses: number;
//   repetition?: boolean;
//   repetitionEnd?: number;
//   /**
//    * If row has verse ref, then this is number of repetitions of whole verse.
//    * If whole verse has no repetition, then this number is 0.
//    */
//   collapsedRepetition?: number;
// }
//
// /**
//  * Działa? Działa - to na ch* drążyć temat
//  * @param verses
//  */
// export const calculateRepetitions = (verses: IVerse[]): IRepetitionSize[] => {
//   const sizes: IRepetitionSize[] = [{ lines: 0, verses: 0 }];
//
//   for (let i = 0; i < verses.length; ++i) {
//     let verse = verses[i];
//     let lines = verse.lines;
//     let collapsed: number | undefined;
//
//     if (verse.verseRef !== undefined && verse.verseRef < verses.length) {
//       verse = verses[verse.verseRef];
//       if (lines.length === 1 && lines[0].repetitionEnd) {
//         collapsed = lines[0].repetitionEnd;
//       } else {
//         collapsed = 0;
//       }
//       lines = verse.lines;
//     }
//
//     for (let j = 0; j < lines.length; ++j) {
//       const line = lines[j];
//
//       let lastSize = sizes[sizes.length - 1];
//
//       if (i > 0 && j === 0) {
//         if ((line.repetition && !lastSize.repetitionEnd) || !lastSize.repetition) {
//           ++lastSize.verses;
//         } else {
//           lastSize = { lines: 0, verses: 1 };
//           sizes.push(lastSize);
//         }
//         if (collapsed !== undefined) {
//           sizes.push({lines: 0, verses: 0, collapsedRepetition: })
//         }
//       }
//
//       if (line.repetition) {
//         if (lastSize.repetition && !lastSize.repetitionEnd) {
//           ++lastSize.lines;
//         } else {
//           lastSize = { lines: 1, verses: 0, repetition: true };
//           sizes.push(lastSize);
//         }
//         if (line.repetitionEnd) {
//           lastSize.repetitionEnd = line.repetitionEnd;
//         }
//       } else if (lastSize.repetition) {
//         sizes.push({ lines: 1, verses: 0 });
//       } else {
//         ++lastSize.lines;
//       }
//     }
//   }
//
//   if (!sizes[sizes.length - 1].repetition) {
//     sizes.pop();
//   }
//
//   console.log(sizes);
//
//   return sizes;
// };
