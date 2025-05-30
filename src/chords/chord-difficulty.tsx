import { IChordDifficulty } from '../store/songbook.reducer.ts';

export type TDifficultyPreset = -1 | 1 | 2 | 3 | 4;

export const getDifficultyPreset = (difficulty: IChordDifficulty): TDifficultyPreset => {
  const difficultyMask = getDifficultyMask(difficulty);
  if (difficultyMask === expertMask) return 4;
  if (difficultyMask === hardMask) return 3;
  if (difficultyMask === semiMask) return 2;
  if (difficultyMask === easyMask) return 1;
  return -1;
};

export const getDifficultyFromPreset = (difficulty: number): IChordDifficulty => {
  if (difficulty === 1) return easy;
  if (difficulty === 2) return semi;
  if (difficulty === 3) return hard;
  return expert;
};

export const easy: IChordDifficulty = {
  hideUncommonAdditionals: true,
  guitarIntervalModifications: true,
  splitSuspensions: true,
  hideUnisonAndFifth: true,
  singleAdditional: true,
  guitarDiminishedChords: true,
  hideBase: true,
  hideBaseAdditional: true,
  hideAlternatives: true,
  signAccidentals: false,
  hideAdditionals269: true,
  hideFourths: true,
  enharmonicFlats: true,
  enharmonicSharps: true,
  americanNotation: false,
};

export const semi: IChordDifficulty = {
  hideUncommonAdditionals: true,
  guitarIntervalModifications: true,
  splitSuspensions: true,
  hideUnisonAndFifth: true,
  singleAdditional: true,
  guitarDiminishedChords: true,
  hideBase: true,
  hideBaseAdditional: true,
  hideAlternatives: true,
  signAccidentals: false,
  hideAdditionals269: false,
  hideFourths: false,
  enharmonicFlats: true,
  enharmonicSharps: true,
  americanNotation: false,
};

export const hard: IChordDifficulty = {
  hideUncommonAdditionals: false,
  guitarIntervalModifications: true,
  splitSuspensions: true,
  hideUnisonAndFifth: false,
  singleAdditional: false,
  guitarDiminishedChords: true,
  hideBase: true,
  hideBaseAdditional: true,
  hideAlternatives: false,
  signAccidentals: false,
  hideAdditionals269: false,
  hideFourths: false,
  enharmonicFlats: false,
  enharmonicSharps: true,
  americanNotation: false,
};

export const expert: IChordDifficulty = {
  hideUncommonAdditionals: false,
  guitarIntervalModifications: false,
  splitSuspensions: false,
  hideUnisonAndFifth: false,
  singleAdditional: false,
  guitarDiminishedChords: false,
  hideBase: false,
  hideBaseAdditional: true,
  hideAlternatives: false,
  signAccidentals: false,
  hideAdditionals269: false,
  hideFourths: false,
  enharmonicFlats: false,
  enharmonicSharps: false,
  americanNotation: false,
};

const getDifficultyMask = (difficulty: IChordDifficulty): number => {
  return (
    (difficulty.hideUncommonAdditionals ? 1 : 0) |
    ((difficulty.guitarIntervalModifications ? 1 : 0) << 1) |
    ((difficulty.splitSuspensions ? 1 : 0) << 2) |
    ((difficulty.hideUnisonAndFifth ? 1 : 0) << 3) |
    ((difficulty.singleAdditional ? 1 : 0) << 4) |
    ((difficulty.guitarDiminishedChords ? 1 : 0) << 5) |
    ((difficulty.hideBase ? 1 : 0) << 6) |
    ((difficulty.hideBaseAdditional ? 1 : 0) << 7) |
    ((difficulty.hideAlternatives ? 1 : 0) << 8) |
    ((difficulty.hideAlternativesColumn ? 1 : 0) << 9) |
    ((difficulty.signAccidentals ? 1 : 0) << 10) |
    ((difficulty.hideAdditionals269 ? 1 : 0) << 11) |
    ((difficulty.hideFourths ? 1 : 0) << 12) |
    ((difficulty.enharmonicFlats ? 1 : 0) << 13) |
    ((difficulty.enharmonicSharps ? 1 : 0) << 14) |
    ((difficulty.americanNotation ? 1 : 0) << 15)
  );
};

const easyMask = getDifficultyMask(easy);
const semiMask = getDifficultyMask(semi);
const hardMask = getDifficultyMask(hard);
const expertMask = getDifficultyMask(expert);
