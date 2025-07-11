export type TUnits = 'kg' | 'lbs';

export const lbsToKg = (lbs: number): number => {
  return 0.45359237 * lbs;
};

export const kgToLbs = (kg: number): number => {
  return 2.20462262 * kg;
};

export const normalize = (v: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, Math.round(v)));
};

export const toKg = (v: number, units: TUnits) => {
  return units === 'lbs' ? lbsToKg(v) : v;
};

export const toUnits = (kg: number, units: TUnits) => {
  return units === 'lbs' ? kgToLbs(kg) : kg;
};
