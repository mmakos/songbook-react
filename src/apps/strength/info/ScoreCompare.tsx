import { ILifterResults } from '../output/WilksSingleOutput.tsx';
import { MaxRepMethod, repsForRM, weightForRM } from '../reps.calc.ts';
import { FC } from 'react';
import { TUnits } from '../units.ts';
import { calculateScoreCoefficient, ScoreMethod } from '../wilks.calc.ts';

interface IScoreCompareProps {
  results: ILifterResults;
  other: ILifterResults;
  inputIdx: number;
  rmMethod: MaxRepMethod;
  scoreMethod: ScoreMethod;
  units: TUnits;
  multi?: boolean;
}

const repeats = (n: number) => {
  if (n === 1) return 'powtórzenie';
  if ((n >= 4 && n <= 21) || n % 10 > 4 || n % 10 === 0) return 'powtórzeń';
  return 'powtórzenia';
};

const ScoreCompare: FC<IScoreCompareProps> = ({ results, other, inputIdx, rmMethod, scoreMethod, units, multi }) => {
  const diff = results.score![scoreMethod] / other.score![scoreMethod];

  const [weight, reps] = results.liftedWeights[inputIdx];

  const coefficient = calculateScoreCoefficient(results.bodyWeight, results.sex, scoreMethod);
  const targetWeight = other.score![scoreMethod] / coefficient;
  const rmReps = repsForRM(targetWeight, weight, rmMethod);

  return (
    <div>
      „{results.name}” osiągn{results.sex === 'male' ? 'ął' : 'ęła'} wynik {(diff > 1 ? diff : 1 / diff).toFixed(2)}{' '}
      raza {diff > 1 ? 'lepszy' : 'gorszy'} niż „{other.name}”. Aby się z ni{other.sex === 'male' ? 'm' : 'ą'} zrównać,{' '}
      {diff < 1 ? 'musi podnieść' : 'wystarczy, że podniesie'} {targetWeight.toFixed(1)} {units}
      {multi ? (
        '.'
      ) : (
        <>
          , czyli
          <ul>
            <li>
              {weight.toFixed(1)} {units} na {rmReps} {repeats(rmReps)}
            </li>
            <li>
              {weightForRM(targetWeight, reps, rmMethod).toFixed(1)} {units} na {reps.toFixed()} {repeats(reps)}
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default ScoreCompare;
