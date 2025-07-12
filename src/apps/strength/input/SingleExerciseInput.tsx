import { Divider, InputAdornment, Stack, Typography } from '@mui/material';
import NumberField from '../../../components/NumberField.tsx';
import { FC } from 'react';
import { TUnits } from '../units.ts';

interface ISingleExerciseInputProps {
  label?: string;
  liftedWeight: [string, string];
  setLiftedWeight: (liftedWeight: [string, string]) => void;
  units: TUnits;
}

const SingleExerciseInput: FC<ISingleExerciseInputProps> = ({ label, liftedWeight, setLiftedWeight, units }) => {
  return (
    <Stack spacing={2} width="100%">
      {label && (
        <Divider>
          <Typography variant="body2">{label}</Typography>
        </Divider>
      )}
      <NumberField
        size="small"
        label="Ciężar"
        value={liftedWeight[0]}
        onChange={(e) => setLiftedWeight([e.target.value, liftedWeight[1]])}
        slotProps={{
          htmlInput: { min: 1, max: units === 'kg' ? 2000 : 5000, step: units === 'kg' ? 0.5 : 1 },
          input: { endAdornment: <InputAdornment position="end">{units}</InputAdornment> },
        }}
        onFocus={(event) => event.target.select()}
        sx={{ minWidth: '10ch' }}
      />
      <NumberField
        size="small"
        label="Powtórzenia"
        value={liftedWeight[1]}
        onChange={(e) => setLiftedWeight([liftedWeight[0], e.target.value])}
        slotProps={{
          htmlInput: { min: 1, max: 50, step: 1 },
        }}
        onFocus={(event) => event.target.select()}
        sx={{ minWidth: '10ch' }}
      />
    </Stack>
  );
};

export default SingleExerciseInput;
