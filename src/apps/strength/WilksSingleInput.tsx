import { TSex } from './wilks.calc.ts';
import { Exercise } from './Wilks.tsx';
import { TUnits } from './units.ts';
import { InputAdornment, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import BasicTooltip from '../../components/BasicTooltip.tsx';
import { Female, Male } from '@mui/icons-material';
import NumberField from '../../components/NumberField.tsx';
import ExerciseInput from './ExerciseInput.tsx';
import { FC } from 'react';

export interface ILifter {
  name: string;
  sex: TSex;
  bodyWeight: string;
  liftedWeight: [string, string][];
}

interface IWilksSingleProps {
  lifter: ILifter;
  patchLifter: (lifter: Partial<ILifter>) => void;
  exercise: Exercise;
  units: TUnits;
}

const WilksSingleInput: FC<IWilksSingleProps> = ({ lifter, patchLifter, exercise, units }) => {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          label="Osoba"
          value={lifter.name}
          onChange={(event) => patchLifter({ name: event.target.value })}
          fullWidth
        />
        <ToggleButtonGroup
          size="small"
          value={lifter.sex}
          onChange={(_, v) => v && patchLifter({ sex: v as TSex })}
          exclusive
        >
          <BasicTooltip title="Mężczyzna">
            <ToggleButton value="male">
              <Male />
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title="Kobieta">
            <ToggleButton value="female">
              <Female />
            </ToggleButton>
          </BasicTooltip>
        </ToggleButtonGroup>
      </Stack>
      <NumberField
        size="small"
        label="Masa ciała"
        value={lifter.bodyWeight}
        onChange={(event) => patchLifter({ bodyWeight: event.target.value })}
        slotProps={{
          htmlInput: { min: 1, max: units === 'kg' ? 500 : 1000, step: units === 'kg' ? 0.5 : 1 },
          input: { endAdornment: <InputAdornment position="end">{units}</InputAdornment> },
        }}
        onFocus={(event) => event.target.select()}
      />
      <ExerciseInput exercise={exercise} lifter={lifter} patchLifter={patchLifter} units={units} />
    </Stack>
  );
};

export default WilksSingleInput;
