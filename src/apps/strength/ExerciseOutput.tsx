import { FC } from 'react';
import { ILifterResults } from './WilksSingleOutput.tsx';
import { Exercise } from './Wilks.tsx';
import { Stack } from '@mui/material';
import SingleExerciseOutput from './SingleExerciseOutput.tsx';
import { TUnits } from './units.ts';

interface IExerciseOutput {
  exercise: Exercise;
  lifter: ILifterResults;
  units: TUnits;
}

const ExerciseOutput: FC<IExerciseOutput> = ({ lifter, exercise, units }) => {
  if (exercise === Exercise.POWERLIFT)
    return (
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 1 }}>
        {['bench', 'squat', 'deadlift'].map((e, i) => (
          <SingleExerciseOutput key={e} liftedWeight={lifter.liftedWeights[i] ?? NaN} units={units} />
        ))}
      </Stack>
    );

  return <SingleExerciseOutput liftedWeight={lifter.liftedWeights[0]} units={units} />;
};

export default ExerciseOutput;
