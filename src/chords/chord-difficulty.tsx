import { IChordDifficulty } from '../store/songbook.reducer.ts';

export const getDifficultyPreset = (difficulty: IChordDifficulty): 1 | 2 | 3 | null => {
  const difficultyMask = getDifficultyMask(difficulty);
  if (difficultyMask === hardMask) {
    return 3;
  } else if (difficultyMask === semiMask) {
    return 2;
  } else if (difficultyMask === easyMask) {
    return 1;
  }
  return null;
};

export const getDifficultyFromPreset = (difficulty: number): IChordDifficulty => {
  if (difficulty === 1) return easy;
  if (difficulty === 2) return semi;
  return hard;
}

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
};

export const semi: IChordDifficulty = {
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
};

export const hard: IChordDifficulty = {
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
    ((difficulty.signAccidentals ? 1 : 0) << 9)
  );
};

const easyMask = getDifficultyMask(easy);
const semiMask = getDifficultyMask(semi);
const hardMask = getDifficultyMask(hard);
