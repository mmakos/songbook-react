import SingleExerciseInput from './SingleExerciseInput.tsx';
import { TUnits } from './units.ts';
import { Exercise } from './Wilks.tsx';
import { ILifter } from './WilksSingleInput.tsx';
import { Stack } from '@mui/material';
import { FC } from 'react';

interface IExerciseInputProps {
  exercise: Exercise;
  lifter: ILifter;
  patchLifter: (lifter: Partial<ILifter>) => void;
  units: TUnits;
}

const setArrayElement = <T,>(array: T[], element: T, index: number, defaultValue: () => T): T[] => {
  while (array.length <= index) {
    array.push(defaultValue());
  }
  array[index] = element;
  return array;
};

const ExerciseInput: FC<IExerciseInputProps> = ({ exercise, lifter, patchLifter, units }) => {
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
    />
  );
};

export default ExerciseInput;
