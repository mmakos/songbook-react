export enum MaxRepMethod {
  EPLEY = 'Epley',
  BRZYCKI = 'Brzycki',
}

export const oneRepMax = (reps: number, liftedWeight: number, method: MaxRepMethod): number => {
  return (method === MaxRepMethod.EPLEY ? epleyRepMax : brzyckiRepMax)(reps, liftedWeight);
};

const epleyRepMax = (reps: number, liftedWeight: number): number => {
  if (reps === 0) return NaN;
  if (reps === 1) return liftedWeight;
  return liftedWeight + (liftedWeight * reps) / 30;
};

const brzyckiRepMax = (reps: number, liftedWeight: number): number => {
  if (reps === 0) return NaN;
  return (liftedWeight * 36) / (37 - reps);
};

export const epleyRepWeight = (reps: number, oneRepMax: number): number => {
  if (reps === 1) return oneRepMax;
  return (30 * oneRepMax) / (reps + 30);
};
