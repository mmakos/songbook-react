import { ILifterResults } from '../output/WilksSingleOutput.tsx';
import { MaxRepMethod, repsForRM, weightForRM } from '../reps.calc.ts';
import { FC } from 'react';
import { TUnits } from '../units.ts';

interface IOneRepMaxCompareProps {
  results: ILifterResults;
  other: ILifterResults;
  inputIdx: number;
  method: MaxRepMethod;
  units: TUnits;
}

const repeats = (n: number) => {
  if (n === 1) return 'powtórzenie';
  if ((n >= 4 && n <= 21) || n % 10 > 4 || n % 10 === 0) return 'powtórzeń';
  return 'powtórzenia';
};

const OneRepMaxCompare: FC<IOneRepMaxCompareProps> = ({ results, other, inputIdx, method, units }) => {
  const rm = results.maxWeights[inputIdx];
  const orm = other.maxWeights[inputIdx];

  const [weight, reps] = results.liftedWeights[inputIdx];
  const rmReps = repsForRM(other.maxWeights[inputIdx], weight, method);

  return (
    <div>
      „{results.name}” podni{results.sex === 'male' ? 'ósł' : 'osła'} {(rm / orm).toFixed(2)} tego co „{other.name}
      ”. Aby się z ni{other.sex === 'male' ? 'm' : 'ą'} zrównać,{' '}
      {rm < orm ? 'musi podnieść' : 'wystarczy, że podniesie'}:
      <ul>
        <li>
          {weight.toFixed(1)} {units} na {rmReps} {repeats(rmReps)}
        </li>
        <li>
          {weightForRM(other.maxWeights[inputIdx], reps, method).toFixed(1)} {units} na {reps.toFixed()} {repeats(reps)}
        </li>
      </ul>
    </div>
  );
};

export default OneRepMaxCompare;
