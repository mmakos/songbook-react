import { InputAdornment, TextField } from '@mui/material';
import { FC } from 'react';
import { TUnits } from './units.ts';
import { toFixed } from './Wilks.tsx';

interface ISingleExerciseOutputProps {
  liftedWeight: number;
  units: TUnits;
}

const SingleExerciseOutput: FC<ISingleExerciseOutputProps> = ({ liftedWeight, units }) => {
  return (
    <TextField
      size="small"
      value={toFixed(liftedWeight)}
      label={'1RM'}
      slotProps={{ input: { readOnly: true, endAdornment: <InputAdornment position="end">{units}</InputAdornment> } }}
      sx={{ width: 0, flex: 1 }}
      fullWidth
    />
  );
};

export default SingleExerciseOutput;
