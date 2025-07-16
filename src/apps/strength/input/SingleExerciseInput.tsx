import { Divider, InputAdornment, Stack, Typography } from '@mui/material';
import NumberField from '../../../components/NumberField.tsx';
import { FC, useMemo } from 'react';
import { TUnits } from '../units.ts';
import { MaxRepMethod } from '../reps.calc.ts';

interface ISingleExerciseInputProps {
  label?: string;
  liftedWeight: [string, string];
  setLiftedWeight: (liftedWeight: [string, string]) => void;
  units: TUnits;
  rmMethod: MaxRepMethod;
}

const SingleExerciseInput: FC<ISingleExerciseInputProps> = ({
  label,
  liftedWeight,
  setLiftedWeight,
  units,
  rmMethod,
}) => {
  const repsError = useMemo(() => {
    const maxReps = rmMethod === 'Lombardi' ? 15 : 10;
    if (+liftedWeight[1] > maxReps) return `Liczba powtórzeń powinna być mniejsza od ${maxReps}`;
  }, [rmMethod, liftedWeight])

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
        error={!!repsError}
        helperText={repsError}
      />
    </Stack>
  );
};

export default SingleExerciseInput;
