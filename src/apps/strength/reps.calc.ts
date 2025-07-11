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

export const oneRepMax = (reps: number, weight: number, method: MaxRepMethod): number => {
  if (reps <= 0) return NaN;
  if (reps === 1) return weight;
  return formulas[method](reps, weight);
};
