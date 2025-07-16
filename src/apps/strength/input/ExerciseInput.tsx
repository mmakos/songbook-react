import SingleExerciseInput from './SingleExerciseInput.tsx';
import { TUnits } from '../units.ts';
import { Exercise } from '../Wilks.tsx';
import { ILifter } from './WilksSingleInput.tsx';
import { Stack } from '@mui/material';
import { FC } from 'react';
import { MaxRepMethod } from '../reps.calc.ts';

interface IExerciseInputProps {
  exercise: Exercise;
  lifter: ILifter;
  patchLifter: (lifter: Partial<ILifter>) => void;
  units: TUnits;
  rmMethod: MaxRepMethod;
}

const setArrayElement = <T,>(array: T[], element: T, index: number, defaultValue: () => T): T[] => {
  while (array.length <= index) {
    array.push(defaultValue());
  }
  array[index] = element;
  return array;
};

const ExerciseInput: FC<IExerciseInputProps> = ({ exercise, lifter, patchLifter, units, rmMethod }) => {
  if (exercise === Exercise.POWERLIFT)
    return (
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 1 }}>
        {['Ławka', 'Przysiad', 'Martwy'].map((e, i) => (
          <SingleExerciseInput
            key={e}
            label={e}
            liftedWeight={lifter.liftedWeight[i] ?? ['', '']}
            setLiftedWeight={(weight) =>
              patchLifter({
                liftedWeight: [...setArrayElement<[string, string]>(lifter.liftedWeight, weight, i, () => ['', ''])],
              })
            }
            units={units}
            rmMethod={rmMethod}
          />
        ))}
      </Stack>
    );

  return (
    <SingleExerciseInput
      liftedWeight={lifter.liftedWeight[0] ?? ['', '']}
      setLiftedWeight={(weight) =>
        patchLifter({
          liftedWeight: [...setArrayElement<[string, string]>(lifter.liftedWeight, weight, 0, () => ['', ''])],
        })
      }
      units={units}
      rmMethod={rmMethod}
    />
  );
};

export default ExerciseInput;
