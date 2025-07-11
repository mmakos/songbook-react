export type TUnits = 'kg' | 'lbs';

export const lbsToKg = (lbs: number): number => {
  return 0.45359237 * lbs;
};

export const kgToLbs = (kg: number): number => {
  return 2.20462262 * kg;
};

export const toKg = (v: number, units: TUnits) => {
  return units === 'lbs' ? lbsToKg(v) : v;
};
