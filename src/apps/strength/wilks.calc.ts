export type TSex = 'male' | 'female';
export type TMethod = 'new' | 'original';

const originalCoefficients: Record<TSex, number[]> & { numerator: number } = {
  numerator: 500,
  male: [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8],
  female: [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-5, -9.054e-8],
};

const newCoefficients: Record<TSex, number[]> & { numerator: number } = {
  numerator: 600,
  male: [47.46178854, 8.472061379, 0.07369410346, -0.001395833811, 7.07665973070743e-6, -1.20804336482315e-8],
  female: [-125.4255398, 13.71219419, -0.03307250631, -0.001050400051, 9.38773881462799e-6, -2.3334613884954e-8],
};

export const getCoefficientsTable = (method: TMethod) => {
  return method === 'original' ? originalCoefficients : newCoefficients;
};

export const calculateWilks = (bodyWeight: number, sex: TSex, method: TMethod) => {
  const coefficientsTable = method === 'original' ? originalCoefficients : newCoefficients;
  const coefficients = coefficientsTable[sex];

  let denominator = 0;
  for (let i = 0; i < coefficients.length; ++i) {
    denominator += coefficients[i] * bodyWeight ** i;
  }
  return coefficientsTable.numerator / denominator;
};
