import { calculateWilks, TMethod, TSex } from './wilks.calc.ts';
import { FC, useMemo, useState } from 'react';
import {
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Female, HelpOutline, Male } from '@mui/icons-material';
import NumberField from '../../components/NumberField.tsx';
import WilksCoefficientHelp from './WilksCoefficientHelp.tsx';
import WilksPointsHelp from './WilksPointsHelp.tsx';
import { kgToLbs, lbsToKg, normalize, toKg, toUnits, TUnits } from './units.ts';
import BasicTooltip from '../../components/BasicTooltip.tsx';
import { epleyRepMax, epleyRepWeight } from './reps.calc.ts';

export type TWilksHelp = 'coefficient' | 'points';

export interface ILifter {
  name: string;
  sex: TSex;
  bodyWeight: string;

  bench: number;
  benchInput: string;
  benchReps: number;
  benchRepMax: number;

  squat: number;
  squatInput: string;
  squatReps: number;
  squatRepMax: number;

  deadlift: number;
  deadliftInput: string;
  deadliftReps: number;
  deadliftRepMax: number;

  liftedWeight: number;

  wilksCoefficient: number;
  wilks: number;
  wilksInput: string;
  units: TUnits;
}

interface IWilksSingleProps {
  units: TUnits;
  method: TMethod;

  lifter: ILifter;
  updateLifter: (lifter: ILifter) => void;
}

const WilksSingle: FC<IWilksSingleProps> = ({ units, method, lifter, updateLifter }) => {
  const [help, setHelp] = useState<TWilksHelp>();

  useMemo(() => {
    lifter.wilksCoefficient = calculateWilks(toKg(+lifter.bodyWeight, units), lifter.sex, method);
    lifter.wilks = lifter.wilksCoefficient * toKg(lifter.liftedWeight, units);
    lifter.wilksInput = lifter.wilks.toFixed(3);
  }, [method]);

  useMemo(() => {
    if (lifter.units === units) return;
    lifter.units = units;
    if (units === 'kg') {
      lifter.bodyWeight = normalize(lbsToKg(+lifter.bodyWeight), 1, 500).toFixed(1);
      lifter.squat = normalize(lbsToKg(lifter.squat), 1, 2000);
    } else {
      lifter.bodyWeight = normalize(kgToLbs(+lifter.bodyWeight), 1, 1000).toFixed(1);
      lifter.squat = normalize(kgToLbs(lifter.squat), 1, 5000);
    }
    lifter.squatInput = lifter.squat.toFixed(1);
    lifter.liftedWeight = epleyRepMax(lifter.reps, lifter.squat);
  }, [units]);

  const { bodyWeight, sex, squatInput, wilksCoefficient, wilksInput, name, reps, liftedWeight } = lifter;

  const updateLifterProp = (props: Partial<ILifter>) => {
    if (props.benchInput !== undefined) {
      props.bench = +props.benchInput;
    } else if (props.wilksInput !== undefined) {
      props.wilks = +props.wilksInput;
    }

    const l: ILifter = { ...lifter, ...props };

    if (props.wilks !== undefined) {
      l.liftedWeight = toUnits(l.wilks / l.wilksCoefficient, units);
      l.squat = epleyRepWeight(l.reps, l.liftedWeight);
      l.squatInput = l.squat.toFixed(1);
    } else {
      if (props.reps !== undefined || props.bench !== undefined) {
        l.liftedWeight = epleyRepMax(l.reps, l.squat);
      }
      if (props.bodyWeight !== undefined || props.sex !== undefined) {
        l.wilksCoefficient = calculateWilks(toKg(+l.bodyWeight, units), l.sex, method);
      }
      l.wilks = l.wilksCoefficient * toKg(l.liftedWeight, units);
      l.wilksInput = l.wilks.toFixed(3);
    }

    updateLifter(l);
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1}>
        <TextField
          label="Osoba"
          value={name}
          onChange={(event) => updateLifterProp({ name: event.target.value })}
          fullWidth
        />
        <ToggleButtonGroup value={sex} onChange={(_, v) => v && updateLifterProp({ sex: v as TSex })} exclusive>
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
        label="Masa ciała"
        value={bodyWeight}
        onChange={(event) => updateLifterProp({ bodyWeight: event.target.value })}
        slotProps={{
          htmlInput: { min: 1, max: units === 'kg' ? 500 : 1000, step: units === 'kg' ? 0.5 : 1 },
          input: { endAdornment: <InputAdornment position="end">{units}</InputAdornment> },
        }}
        onFocus={(event) => event.target.select()}
        required
      />
      <Stack direction="row" spacing={1}>
        <Stack spacing={2} width="100%">
          <Divider>
            <Typography variant="body2">Ławka</Typography>
          </Divider>
          <NumberField
            label="Ciężar"
            value={lifter.benchInput}
            slotProps={{
              htmlInput: { min: 1, max: units === 'kg' ? 2000 : 5000, step: units === 'kg' ? 0.5 : 1 },
              input: { endAdornment: <InputAdornment position="end">{units}</InputAdornment> },
            }}
            onFocus={(event) => event.target.select()}
          />
          <NumberField
            label="Powtórzenia"
            value={lifter.benchReps}
            slotProps={{
              htmlInput: { min: 1, max: 50, step: 1 },
            }}
            onFocus={(event) => event.target.select()}
          />
        </Stack>
        <Stack spacing={2} width="100%">
          <Divider>
            <Typography variant="body2">Przysiad</Typography>
          </Divider>
          <NumberField
            label="Ciężar"
            value={lifter.squatInput}
            slotProps={{
              htmlInput: { min: 1, max: units === 'kg' ? 2000 : 5000, step: units === 'kg' ? 0.5 : 1 },
              input: { endAdornment: <InputAdornment position="end">{units}</InputAdornment> },
            }}
            onFocus={(event) => event.target.select()}
          />
          <NumberField
            label="Powtórzenia"
            value={lifter.squatReps}
            slotProps={{
              htmlInput: { min: 1, max: 50, step: 1 },
            }}
            onFocus={(event) => event.target.select()}
          />
        </Stack>
        <Stack spacing={2} width="100%">
          <Divider>
            <Typography variant="body2">Martwy</Typography>
          </Divider>
          <NumberField
            label="Ciężar"
            value={lifter.deadliftInput}
            slotProps={{
              htmlInput: { min: 1, max: units === 'kg' ? 2000 : 5000, step: units === 'kg' ? 0.5 : 1 },
              input: { endAdornment: <InputAdornment position="end">{units}</InputAdornment> },
            }}
            onFocus={(event) => event.target.select()}
          />
          <NumberField
            label="Powtórzenia"
            value={lifter.deadliftReps}
            slotProps={{
              htmlInput: { min: 1, max: 50, step: 1 },
            }}
            onFocus={(event) => event.target.select()}
          />
        </Stack>
      </Stack>
      <Divider>
        <Typography variant="body2">Wyniki</Typography>
      </Divider>
      <Stack direction="row" spacing={1}>
        <TextField
          label="Ławka"
          value={lifter.benchRepMax}
          slotProps={{
            input: { readOnly: true, endAdornment: <InputAdornment position="end">{units}</InputAdornment> },
          }}
        />
        <TextField
          label="Przysiad"
          value={lifter.squatRepMax}
          slotProps={{
            input: { readOnly: true, endAdornment: <InputAdornment position="end">{units}</InputAdornment> },
          }}
        />
        <TextField
          label="Marwty"
          value={lifter.deadliftRepMax}
          slotProps={{
            input: { readOnly: true, endAdornment: <InputAdornment position="end">{units}</InputAdornment> },
          }}
        />
      </Stack>
      <TextField
        label="Łączny ciężar"
        value={liftedWeight.toFixed(1)}
        slotProps={{ input: { readOnly: true, endAdornment: <InputAdornment position="end">{units}</InputAdornment> } }}
      />
      <TextField
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" sx={{ color: 'text.secondary' }} onClick={() => setHelp('coefficient')}>
                  <HelpOutline />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        label="Współczynnik Wilks'a"
        value={wilksCoefficient.toFixed(4)}
      />
      <NumberField
        label="Punkty Wilks'a"
        value={wilksInput}
        onChange={(event) => updateLifterProp({ wilksInput: event.target.value })}
        slotProps={{
          htmlInput: { min: 1, max: 1000, step: 1 },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" sx={{ color: 'text.secondary' }} onClick={() => setHelp('points')}>
                  <HelpOutline />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        onFocus={(event) => event.target.select()}
      />
      {help === 'coefficient' && (
        <WilksCoefficientHelp weight={+bodyWeight} method={method} sex={sex} close={() => setHelp(undefined)} />
      )}
      {help === 'points' && (
        <WilksPointsHelp
          weight={+bodyWeight}
          bodyWeight={+bodyWeight}
          wilksCoefficient={wilksCoefficient}
          sex={sex}
          close={() => setHelp(undefined)}
        />
      )}
    </Stack>
  );
};

export default WilksSingle;
