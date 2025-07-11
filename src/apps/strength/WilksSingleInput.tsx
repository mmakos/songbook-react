import { TSex } from './wilks.calc.ts';
import { Exercise } from './Wilks.tsx';
import { TUnits } from './units.ts';
import { IconButton, InputAdornment, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import BasicTooltip from '../../components/BasicTooltip.tsx';
import { Add, Female, Male, Remove } from '@mui/icons-material';
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
  addLifter?: () => void;
  removeLifter?: () => void;
}

const WilksSingleInput: FC<IWilksSingleProps> = ({ lifter, patchLifter, exercise, units, addLifter, removeLifter }) => {
  return (
    <Stack spacing={2} width='100%'>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          size="small"
          label="Zawodnik"
          value={lifter.name}
          onChange={(event) => patchLifter({ name: event.target.value })}
          onFocus={(event) => event.target.select()}
          sx={{ width: '10ch', flex: 1 }}
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
        <div>
          <Stack direction="row">
            {addLifter && (
              <BasicTooltip title="Dodaj osobę do porównania">
                <IconButton size="small" onClick={addLifter}>
                  <Add />
                </IconButton>
              </BasicTooltip>
            )}
            {removeLifter && (
              <BasicTooltip title="Usuń osobę z porównania">
                <IconButton size="small" onClick={removeLifter}>
                  <Remove />
                </IconButton>
              </BasicTooltip>
            )}
          </Stack>
        </div>
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
