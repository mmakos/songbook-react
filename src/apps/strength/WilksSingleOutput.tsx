import { TUnits } from './units.ts';
import { Exercise, toFixed } from './Wilks.tsx';
import ExerciseOutput from './ExerciseOutput.tsx';
import { FC } from 'react';
import { InputAdornment, Stack, TextField } from '@mui/material';
import { ScoreMethod, TScore } from './wilks.calc.ts';

export interface ILifterResults {
  liftedWeights: number[];
  liftedWeight: number;
  score: TScore;
}

interface IWilksSingleOutputProps {
  exercise: Exercise;
  lifter: ILifterResults;
  // method: ScoreMethod;
  units: TUnits;
}

const WilksSingleOutput: FC<IWilksSingleOutputProps> = ({ lifter, units, exercise }) => {
  return (
    <Stack spacing={2}>
      {exercise === Exercise.POWERLIFT && <ExerciseOutput lifter={lifter} exercise={exercise} units={units} />}
      <TextField
        size="small"
        label={exercise === Exercise.POWERLIFT ? 'Suma trójboju' : '1RM'}
        value={toFixed(lifter.liftedWeight)}
        slotProps={{ input: { readOnly: true, endAdornment: <InputAdornment position="end">{units}</InputAdornment> } }}
      />
      <TextField
        size="small"
        label="% masy ciała"
        value={toFixed(lifter.score[ScoreMethod.PERCENTAGE], 1)}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          },
        }}
      />
      <TextField
        size="small"
        label="Punkty Wilks'a"
        value={toFixed(lifter.score[ScoreMethod.WILKS], 3)}
        slotProps={{ input: { readOnly: true } }}
      />
      <TextField
        size="small"
        label="Punkty Wilks'a (2020)"
        value={toFixed(lifter.score[ScoreMethod.WILKS_2020], 3)}
        slotProps={{ input: { readOnly: true } }}
      />
      <TextField
        size="small"
        label="Punkty DOTS"
        value={toFixed(lifter.score[ScoreMethod.DOTS], 3)}
        slotProps={{ input: { readOnly: true } }}
      />
    </Stack>
  );
};

export default WilksSingleOutput;
