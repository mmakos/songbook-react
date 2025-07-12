export type TSex = 'male' | 'female';

export enum ScoreMethod {
  PERCENTAGE = 'Procent masy ciała',
  DOTS = 'Punkty DOTS',
  WILKS = "Współczynnik Wilks'a",
  WILKS_2020 = "Nowy współczynnik Wilks'a (2020)",
}

export type TScore = Record<ScoreMethod, number>;

export const coefficientsTables: Record<ScoreMethod, Record<TSex, number[]> & { numerator: number }> = {
  [ScoreMethod.PERCENTAGE]: {
    numerator: 100,
    male: [0, 1],
    female: [0, 1],
  },
  [ScoreMethod.WILKS]: {
    numerator: 500,
    male: [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8],
    female: [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-5, -9.054e-8],
  },
  [ScoreMethod.WILKS_2020]: {
    numerator: 600,
    male: [47.46178854, 8.472061379, 0.07369410346, -0.001395833811, 7.07665973070743e-6, -1.20804336482315e-8],
    female: [-125.4255398, 13.71219419, -0.03307250631, -0.001050400051, 9.38773881462799e-6, -2.3334613884954e-8],
  },
  [ScoreMethod.DOTS]: {
    numerator: 500,
    male: [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -1.093e-6],
    female: [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -1.0706e-6],
  },
};

export const calculateScoreCoefficient = (bodyWeight: number, sex: TSex, method: ScoreMethod): number => {
  const coefficientsTable = coefficientsTables[method];
  const coefficients = coefficientsTable[sex];

  let denominator = 0;
  for (let i = 0; i < coefficients.length; ++i) {
    denominator += coefficients[i] * bodyWeight ** i;
  }
  return coefficientsTable.numerator / denominator;
};

export const calculateScores = (bodyWeight: number, liftedWeight: number, sex: TSex): TScore => ({
  [ScoreMethod.PERCENTAGE]: calculateScoreCoefficient(bodyWeight, sex, ScoreMethod.PERCENTAGE) * liftedWeight,
  [ScoreMethod.DOTS]: calculateScoreCoefficient(bodyWeight, sex, ScoreMethod.DOTS) * liftedWeight,
  [ScoreMethod.WILKS]: calculateScoreCoefficient(bodyWeight, sex, ScoreMethod.WILKS) * liftedWeight,
  [ScoreMethod.WILKS_2020]: calculateScoreCoefficient(bodyWeight, sex, ScoreMethod.WILKS_2020) * liftedWeight,
});
