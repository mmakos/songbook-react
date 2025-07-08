export const epleyRepMax = (reps: number, liftedWeight: number): number => {
  if (reps === 1) return liftedWeight;
  return liftedWeight + (liftedWeight * reps) / 30;
};

export const epleyRepWeight = (reps: number, oneRepMax: number): number => {
  if (reps === 1) return oneRepMax;
  return (30 * oneRepMax) / (reps + 30);
};
