import { TextField } from '@mui/material';
import { FC } from 'react';
import { TUnits } from '../units.ts';
import { toFixed } from '../Wilks.tsx';

interface ISingleExerciseOutputProps {
  liftedWeight: number;
  units: TUnits;
}

const SingleExerciseOutput: FC<ISingleExerciseOutputProps> = ({ liftedWeight, units }) => {
  const w = toFixed(liftedWeight);
  return (
    <TextField
      size="small"
      value={w && `${w} ${units}`}
      label={'1RM'}
      slotProps={{ input: { readOnly: true } }}
      sx={{ minWidth: '10ch' }}
    />
  );
};

export default SingleExerciseOutput;
