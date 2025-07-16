import { ILifterResults } from '../output/WilksSingleOutput.tsx';
import { getMaxReps, MaxRepMethod, repsForRM, weightForRM } from '../reps.calc.ts';
import { FC } from 'react';
import { TUnits } from '../units.ts';
import { Typography } from '@mui/material';

interface IOneRepMaxCompareProps {
  results: ILifterResults;
  other: ILifterResults;
  inputIdx: number;
  rmMethod: MaxRepMethod;
  units: TUnits;
}

const repeats = (n: number) => {
  if (n === 1) return 'powtórzenie';
  if ((n >= 4 && n <= 21) || n % 10 > 4 || n % 10 === 0) return 'powtórzeń';
  return 'powtórzenia';
};

const OneRepMaxCompare: FC<IOneRepMaxCompareProps> = ({ results, other, inputIdx, rmMethod, units }) => {
  const rm = results.maxWeights[inputIdx];
  const orm = other.maxWeights[inputIdx];

  const [weight, reps] = results.liftedWeights[inputIdx];
  const rmReps = repsForRM(other.maxWeights[inputIdx], weight, rmMethod);
  const maxReps = getMaxReps(rmMethod);

  return (
    <div>
      „{results.name}” podni{results.sex === 'male' ? 'ósł' : 'osła'} {(rm / orm).toFixed(2)} tego co „{other.name}
      ”. Aby się z ni{other.sex === 'male' ? 'm' : 'ą'} zrównać,{' '}
      {rm < orm ? 'musi podnieść' : 'wystarczy, że podniesie'}:
      <ul>
        {rm < orm && (
          <li>
            {weightForRM(other.maxWeights[inputIdx], 1, rmMethod).toFixed(1)} {units} na 1 {repeats(1)}
          </li>
        )}
        <Typography component="li" color={rmReps > maxReps ? 'error' : undefined}>
          {weight.toFixed(1)} {units} na {rmReps} {repeats(rmReps)}
          {rmReps > maxReps && ' (to za mały ciężar)'}
        </Typography>
        {reps > 1 && (
          <li>
            {weightForRM(other.maxWeights[inputIdx], reps, rmMethod).toFixed(1)} {units} na {reps.toFixed()}{' '}
            {repeats(reps)}
          </li>
        )}
      </ul>
    </div>
  );
};

export default OneRepMaxCompare;
