import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';
import { calculateWilks, TMethod, TSex } from './wilks.calc.ts';
import WilksSingle, { ILifter } from './WilksSingle.tsx';
import { toKg, TUnits } from './units.ts';

const createInitialWilks = (
  i: number = 1,
  sex: TSex = 'male',
  liftedWeight: number = 100,
  bodyWeight: number = 80,
  method: TMethod = 'original',
  units: TUnits = 'kg'
): ILifter => {
  const wilksCoefficient = calculateWilks(toKg(bodyWeight, units), sex, method);
  const wilks = wilksCoefficient * toKg(liftedWeight, units);

  return {
    name: `Osoba ${i}`,
    sex,
    bench: liftedWeight,
    benchInput: '' + liftedWeight,
    reps: 1,
    liftedWeight: liftedWeight,
    bodyWeight: '' + bodyWeight,
    wilksCoefficient,
    wilks,
    wilksInput: wilks.toFixed(3),
    units,
  };
};

const Wilks = () => {
  const [units, setUnits] = useState<TUnits>('kg');
  const [method, setMethod] = useState<TMethod>('original');

  const [lifters, setLifters] = useState<ILifter[]>(() => [createInitialWilks()]);

  const updateLifter = (i: number, lifter: ILifter) => {
    setLifters(lifters.map((l, j) => (i !== j ? l : lifter)));
  };

  return (
    <Stack spacing={2}>
      <ToggleButtonGroup value={units} onChange={(_, v) => v && setUnits(v as TUnits)} exclusive fullWidth>
        <ToggleButton value="kg">Kilogramy</ToggleButton>
        <ToggleButton value="lbs">Funty</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup value={method} onChange={(_, v) => v && setMethod(v as TMethod)} exclusive fullWidth>
        <ToggleButton value="original">Oryginalny</ToggleButton>
        <ToggleButton value="new">Nowy (2020)</ToggleButton>
      </ToggleButtonGroup>
      {lifters.map((l, i) => (
        <WilksSingle
          key={'l' + i}
          units={units}
          method={method}
          lifter={l}
          updateLifter={(lifter) => updateLifter(i, lifter)}
        />
      ))}
    </Stack>
  );
};

export default Wilks;
