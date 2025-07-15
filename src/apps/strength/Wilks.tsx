import {
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';
import { calculateScores } from './wilks.calc.ts';
import { kgToLbs, lbsToKg, toKg, TUnits } from './units.ts';
import WilksSingleInput, { ILifter } from './input/WilksSingleInput.tsx';
import { MaxRepMethod, oneRepMax } from './reps.calc.ts';
import WilksSingleOutput, { ILifterResults } from './output/WilksSingleOutput.tsx';
import 'katex/dist/katex.min.css';
import { Save, Share } from '@mui/icons-material';
import BasicTooltip from '../../components/BasicTooltip.tsx';
import { getObjectFromStorage, saveObjectToStorage } from '../../store/local-storage.utils.ts';
import { useAppDispatch } from '../../store/songbook.store.ts';
import { notifySuccess } from '../../store/songbook.reducer.ts';
import { useSearchParams } from 'react-router';

interface IWilksInput {
  units: TUnits;
  exercise: Exercise;
  rmMethod: MaxRepMethod;
  lifters: ILifter[];
}

export enum Exercise {
  BENCH_PRESS = 'bench',
  SQUAT = 'squat',
  DEADLIFT = 'deaadlift',
  POWERLIFT = 'powerlift',
}

export const excerciseDisplay: Record<Exercise, string> = {
  [Exercise.BENCH_PRESS]: 'Wyciskanie na ławce',
  [Exercise.SQUAT]: 'Przysiad',
  [Exercise.DEADLIFT]: 'Martwy ciąg',
  [Exercise.POWERLIFT]: 'Trójbój siłowy',
};

const paramToLifter = (key: string, value: string): ILifter => {
  const v = value.split('-');
  const liftedWeight: [string, string][] = [];
  for (let i = 2; i < v.length; i += 2) {
    liftedWeight.push([v[i], v[i + 1] ?? '']);
  }
  return {
    name: key,
    sex: v.length && v[0] === 'female' ? 'female' : 'male',
    bodyWeight: v.length > 1 ? v[1] : '',
    liftedWeight,
  };
};

const paramsToInput = (params: URLSearchParams): Partial<IWilksInput> | undefined => {
  const input: Partial<IWilksInput> = { lifters: [] };
  params.forEach((value, key) => {
    if (key === 'rmMethod') {
      if (Object.values(MaxRepMethod).includes(value as MaxRepMethod)) input.rmMethod = value as MaxRepMethod;
    } else if (key === 'exercise') {
      if (Object.values(Exercise).includes(value as Exercise)) input.exercise = value as Exercise;
    } else if (key === 'units') {
      if (value === 'kg' || value === 'lbs') input.units = value;
    } else {
      input.lifters?.push(paramToLifter(key, value));
    }
  });
  if (input.lifters?.length) return input;
};

const inputToParams = (input: IWilksInput): Record<string, string> => {
  const params: Record<string, string> = {
    rmMethod: input.rmMethod,
    exercise: input.exercise,
    units: input.units,
  };
  input.lifters.forEach((lifter) => {
    params[lifter.name] =
      `${lifter.sex}-${lifter.bodyWeight}-${lifter.liftedWeight.map(([w, r]) => w + '-' + r).join('-')}`;
  });
  return params;
};

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
  maxWeight: NaN,
});

const Wilks = () => {
  const lifterNumber = useRef(1);
  const [units, setUnits] = useState<TUnits>('kg');
  const [exercise, setExercise] = useState<Exercise>(Exercise.BENCH_PRESS);
  const [rmMethod, setRmMethod] = useState<MaxRepMethod>(MaxRepMethod.BRZYCKI);

  const [lifters, setLifters] = useState<ILifter[]>(() => [createLifter()]);
  const [results, setResults] = useState<ILifterResults[]>(() => [createResults()]);

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [params] = useSearchParams();

  useEffect(() => {
    updateResults();
  }, [units, exercise, rmMethod]);

  useEffect(() => {
    const loaded: Partial<IWilksInput> = paramsToInput(params) ?? getObjectFromStorage('strength');
    if (!loaded.lifters?.length) return;
    loaded.exercise && Object.values(Exercise).includes(loaded.exercise) && setExercise(loaded.exercise);
    loaded.rmMethod && Object.values(MaxRepMethod).includes(loaded.rmMethod) && setRmMethod(loaded.rmMethod);
    (loaded.units === 'kg' || loaded.units === 'lbs') && setUnits(loaded.units);
    setLifters(loaded.lifters);
    setResults(loaded.lifters.map(calculateResults));
  }, []);

  const save = () => {
    saveObjectToStorage('strength', { units, exercise, rmMethod, lifters });
    dispatch(notifySuccess('Zapisano wprowadzone dane w przeglądarce'));
  };

  const share = () => {
    const url = new URL(import.meta.env.VITE_HREF + '/strength');
    Object.entries(inputToParams({ rmMethod, exercise, units, lifters })).forEach(([k, v]) =>
      url.searchParams.set(k, v)
    );
    navigator.clipboard
      .writeText(url.toString())
      .then(() => dispatch(notifySuccess('Skopiowano link do schowka')));
  };

  const calculateResults = (lifter: ILifter): ILifterResults => {
    const liftedWeights: [number, number][] = lifter.liftedWeight.map(([w, r]) => [+w, +r]);
    const n = exercise === Exercise.POWERLIFT ? 3 : 1;
    liftedWeights.splice(n, liftedWeights.length - n);
    while (liftedWeights.length < n) liftedWeights.push([NaN, NaN]);
    const maxWeights = liftedWeights.map(([w, r]) => oneRepMax(r, w, rmMethod));
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

  const addLifter = (i: number) => {
    lifters.splice(i + 1, 0, createLifter(++lifterNumber.current));
    results.splice(i + 1, 0, createResults(lifterNumber.current));
    setLifters([...lifters]);
    setResults([...results]);
  };

  return (
    <Stack spacing={2}>
      <Stack spacing={1} direction="row">
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
        <BasicTooltip title="Udostępnij link">
          <IconButton onClick={share}>
            <Share />
          </IconButton>
        </BasicTooltip>
        <BasicTooltip title="Zapisz wprowadzone dane">
          <IconButton onClick={save}>
            <Save />
          </IconButton>
        </BasicTooltip>
      </Stack>
      <FormControl>
        <InputLabel>Metoda obliczania 1RM</InputLabel>
        <Select
          size="small"
          label="Metoda obliczania 1RM"
          value={rmMethod}
          onChange={(e) => setRmMethod(e.target.value as MaxRepMethod)}
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
              {excerciseDisplay[e]}
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
              addLifter={() => addLifter(i)}
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
            oneRepMaxMethod={rmMethod}
            single={results.length <= 1}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default Wilks;
