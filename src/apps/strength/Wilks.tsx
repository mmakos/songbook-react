import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { calculateScores } from './wilks.calc.ts';
import { kgToLbs, lbsToKg, toKg, TUnits } from './units.ts';
import WilksSingleInput, { ILifter } from './input/WilksSingleInput.tsx';
import { MaxRepMethod, oneRepMax } from './reps.calc.ts';
import WilksSingleOutput, { ILifterResults } from './output/WilksSingleOutput.tsx';
import 'katex/dist/katex.min.css';

export enum Exercise {
  BENCH_PRESS = 'Wyciskanie na ławce',
  SQUAT = 'Przysiad',
  DEADLIFT = 'Martwy ciąg',
  POWERLIFT = 'Trójbój siłowy',
}

export const toFixed = (n?: number, fractionDigits: number = 1): string => {
  return !n || isNaN(n) ? '' : n.toFixed(fractionDigits);
};

const createLifter = (i: number = 1): ILifter => ({
  name: `Zawodnik ${i}`,
  sex: 'male',
  bodyWeight: '',
  liftedWeight: [['', '1']],
});

const createResults = (i: number = 1): ILifterResults => ({
  name: `Zawodnik ${i}`,
  sex: 'male',
  bodyWeight: NaN,
  liftedWeights: [],
  maxWeights: [],
  maxWeight: NaN
});

const Wilks = () => {
  const [units, setUnits] = useState<TUnits>('kg');
  const [exercise, setExercise] = useState<Exercise>(Exercise.BENCH_PRESS);
  const [oneRepMaxMethod, setOneRepMaxMethod] = useState<MaxRepMethod>(MaxRepMethod.BRZYCKI);

  const [lifters, setLifters] = useState<ILifter[]>(() => [createLifter()]);
  const [results, setResults] = useState<ILifterResults[]>(() => [createResults()]);

  const theme = useTheme();
  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  const calculateResults = (lifter: ILifter): ILifterResults => {
    const liftedWeights: [number, number][] = lifter.liftedWeight.map(([w, r]) => [+w, +r]);
    const n = exercise === Exercise.POWERLIFT ? 3 : 1;
    liftedWeights.splice(n, liftedWeights.length - n);
    while (liftedWeights.length < n) liftedWeights.push([NaN, NaN]);
    const maxWeights = liftedWeights.map(([w, r]) => oneRepMax(r, w, oneRepMaxMethod));
    const maxWeight = maxWeights.reduce((acc, curr) => acc + (isNaN(curr) ? 0 : curr), 0);
    const bw = +lifter.bodyWeight;
    const score = !bw || isNaN(bw) ? undefined : calculateScores(toKg(bw, units), toKg(maxWeight, units), lifter.sex);
    return {
      name: lifter.name,
      sex: lifter.sex,
      bodyWeight: +lifter.bodyWeight,
      liftedWeights,
      maxWeight,
      maxWeights,
      score,
    };
  };

  const changeWeightUnits = (weight: string, u: TUnits): string => {
    if (!weight) return '';
    const w = +weight;
    if (isNaN(w)) return '';
    return u === 'kg' ? lbsToKg(w).toFixed(1) : kgToLbs(w).toFixed(1);
  };

  const handleUnitsChange = (u: TUnits) => {
    if (units === u) return;
    lifters.forEach((l) => {
      l.bodyWeight = changeWeightUnits(l.bodyWeight, u);
      l.liftedWeight = l.liftedWeight.map((w) => [changeWeightUnits(w[0], u), w[1]]);
    });
    setUnits(u);
  };

  const updateResults = () => {
    setResults(lifters.map(calculateResults));
  };

  const patchLifter = (i: number, lifter: Partial<ILifter>) => {
    lifters[i] = { ...lifters[i], ...lifter };
    results[i] = calculateResults(lifters[i]);
    setLifters([...lifters]);
    setResults([...results]);
  };

  const removeLifter = (i: number) => {
    setLifters(lifters.filter((_, j) => j !== i));
    setResults(results.filter((_, j) => j !== i));
  };

  const addLifter = () => {
    setLifters([...lifters, createLifter(lifters.length + 1)]);
    setResults([...results, createResults(lifters.length + 1)]);
  };

  useEffect(() => {
    updateResults();
  }, [units, exercise, oneRepMaxMethod]);

  return (
    <Stack spacing={2}>
      <ToggleButtonGroup
        size="small"
        value={units}
        onChange={(_, v) => v && handleUnitsChange(v as TUnits)}
        exclusive
        fullWidth
      >
        <ToggleButton value="kg">Kilogramy</ToggleButton>
        <ToggleButton value="lbs">Funty 🤡</ToggleButton>
      </ToggleButtonGroup>
      <FormControl>
        <InputLabel>Metoda obliczania 1RM</InputLabel>
        <Select
          size="small"
          label="Metoda obliczania 1RM"
          value={oneRepMaxMethod}
          onChange={(e) => setOneRepMaxMethod(e.target.value as MaxRepMethod)}
        >
          {Object.values(MaxRepMethod).map((e) => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Ćwiczenie</InputLabel>
        <Select
          size="small"
          label="Ćwiczenie"
          value={exercise}
          onChange={(e) => setExercise(e.target.value as Exercise)}
        >
          {Object.values(Exercise).map((e) => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Divider>Dane zawodników</Divider>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 1 }}>
        {lifters.map((l, i) => (
          <Fragment key={'l' + i}>
            {i > 0 && downSm && <Divider />}
            <WilksSingleInput
              lifter={l}
              patchLifter={(l) => patchLifter(i, l)}
              exercise={exercise}
              units={units}
              addLifter={i === lifters.length - 1 ? addLifter : undefined}
              removeLifter={lifters.length > 1 ? () => removeLifter(i) : undefined}
            />
          </Fragment>
        ))}
      </Stack>
      <Divider>Rezultaty</Divider>
      <Stack
        direction={{ xs: results.length > 1 ? 'column' : 'row', sm: 'row' }}
        spacing={1}
        style={{ marginTop: 0 }}
        sx={{ overflowX: downSm ? 'auto' : undefined, width: '100%', pt: '16px' }}
      >
        {results.map((result, i) => (
          <WilksSingleOutput
            key={'r' + i}
            results={result}
            others={results.filter((_, j) => j !== i)}
            exercise={exercise}
            units={units}
            oneRepMaxMethod={oneRepMaxMethod}
            single={results.length <= 1}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default Wilks;
