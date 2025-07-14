export enum MaxRepMethod {
  BRZYCKI = 'Brzycki',
  EPLEY = 'Epley',
  LOMBARDI = 'Lombardi',
  OCONNER = "O'Conner",
  LANDERS = 'Landers',
  WATHAN = 'Wathan',
  MAYHEW = 'Mayhew',
}

const formulas: Record<MaxRepMethod, (reps: number, weight: number) => number> = {
  [MaxRepMethod.BRZYCKI]: (reps, weight) => (weight * 36) / (37 - reps),
  [MaxRepMethod.EPLEY]: (reps, weight) => weight + (weight * reps) / 30,
  [MaxRepMethod.LOMBARDI]: (reps, weight) => weight * Math.pow(reps, 0.1),
  [MaxRepMethod.OCONNER]: (reps, weight) => weight + (weight * reps) / 40,
  [MaxRepMethod.LANDERS]: (reps, weight) => (weight * 100) / (101.3 - 2.67123 * reps),
  [MaxRepMethod.WATHAN]: (reps, weight) => (weight * 100) / (48.8 + 53.8 * Math.exp(-0.075 * reps)),
  [MaxRepMethod.MAYHEW]: (reps, weight) => (weight * 100) / (52.2 + 41.9 * Math.exp(-0.055 * reps)),
};

const repWeightFormulas: Record<MaxRepMethod, (rm: number, reps: number) => number> = {
  [MaxRepMethod.BRZYCKI]: (rm, reps) => (rm * (37 - reps)) / 36,
  [MaxRepMethod.EPLEY]: (rm, reps) => rm / (1 + reps / 30),
  [MaxRepMethod.LOMBARDI]: (rm, reps) => rm / Math.pow(reps, 0.1),
  [MaxRepMethod.OCONNER]: (rm, reps) => rm / (1 + reps / 40),
  [MaxRepMethod.LANDERS]: (rm, reps) => (rm * (101.3 - 2.67123 * reps)) / 100,
  [MaxRepMethod.WATHAN]: (rm, reps) => (rm * (48.8 + 53.8 * Math.exp(-0.075 * reps))) / 100,
  [MaxRepMethod.MAYHEW]: (rm, reps) => (rm * (52.2 + 41.9 * Math.exp(-0.055 * reps))) / 100,
};

const repsFormulas: Record<MaxRepMethod, (rm: number, weight: number) => number> = {
  [MaxRepMethod.BRZYCKI]: (rm, weight) => 37 - (weight * 36) / rm,
  [MaxRepMethod.EPLEY]: (rm, weight) => 30 * (rm / weight - 1),
  [MaxRepMethod.LOMBARDI]: (rm, weight) => Math.pow(rm / weight, 10),
  [MaxRepMethod.OCONNER]: (rm, weight) => 40 * (rm / weight - 1),
  [MaxRepMethod.LANDERS]: (rm, weight) => (101.3 - (weight * 100) / rm) / 2.67123,
  [MaxRepMethod.WATHAN]: (rm, weight) => -Math.log(((weight * 100) / rm - 48.8) / 53.8) / 0.075,
  [MaxRepMethod.MAYHEW]: (rm, weight) => -Math.log(((weight * 100) / rm - 52.2) / 41.9) / 0.055,
};

export const latexFormulas: Record<MaxRepMethod, string> = {
  [MaxRepMethod.BRZYCKI]: '\\text{1RM} = \\frac{36 \\cdot w}{37 - r}',
  [MaxRepMethod.EPLEY]: '\\text{1RM} = w + \\frac{w \\cdot r}{30}',
  [MaxRepMethod.LOMBARDI]: '\\text{1RM} = w \\cdot r^{0.1}',
  [MaxRepMethod.OCONNER]: '\\text{1RM} = w + \\frac{w \\cdot r}{40}',
  [MaxRepMethod.LANDERS]: '\\text{1RM} = 100 \\cdot \\frac{w}{101.3 - 2.67123 \\cdot r}',
  [MaxRepMethod.WATHAN]: '\\text{1RM} = 100 \\cdot \\frac{w}{48.8 + 53.8 \\cdot e^{-0.075 \\cdot r}}',
  [MaxRepMethod.MAYHEW]: '\\text{1RM} = 100 \\cdot \\frac{w}{52.2 + 41.9 \\cdot e^{-0.055 \\cdot r}}',
};

export const oneRepMax = (reps: number, weight: number, method: MaxRepMethod): number => {
  if (reps <= 0) return NaN;
  if (reps === 1) return weight;
  return formulas[method](reps, weight);
};

export const weightForRM = (rm: number, reps: number, method: MaxRepMethod): number => {
  return repWeightFormulas[method](rm, reps);
};

export const repsForRM = (rm: number, weight: number, method: MaxRepMethod): number => {
  return Math.max(Math.ceil(repsFormulas[method](rm, weight)), 1);
};
