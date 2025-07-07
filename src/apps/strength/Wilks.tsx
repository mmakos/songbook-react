import { IconButton, InputAdornment, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import NumberField from '../../components/NumberField.tsx';
import { useMemo, useState } from 'react';
import { Female, HelpOutline, Male } from '@mui/icons-material';
import { calculateWilks, TMethod, TSex } from './wilks-calc.ts';
import WilksCoefficientHelp from './WilksCoefficientHelp.tsx';
import WilksPointsHelp from './WilksPointsHelp.tsx';

export type TWilksHelp = 'coefficient' | 'points';
export type TUnits = 'kg' | 'lbs';

export const lbsToKg = (lbs: number): number => {
  return 0.45359237 * lbs;
};

const kgToLbs = (kg: number): number => {
  return 2.20462262 * kg;
};

const normalize = (v: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, Math.round(v)));
};

const toKg = (v: number, units: TUnits) => {
  return units === 'lbs' ? lbsToKg(v) : v;
};

const Wilks = () => {
  const [units, setUnits] = useState<TUnits>('kg');
  const [sex, setSex] = useState<TSex>('male');
  const [method, setMethod] = useState<TMethod>('original');
  const [bodyWeight, setBodyWeight] = useState(80);
  const [liftedWeight, setLiftedWeight] = useState(100);

  const [help, setHelp] = useState<TWilksHelp>();

  const handleUnitsChange = (newUnits: TUnits) => {
    if (units === newUnits) return;
    if (newUnits === 'kg') {
      setBodyWeight(normalize(lbsToKg(bodyWeight), 1, 500));
      setLiftedWeight(normalize(lbsToKg(liftedWeight), 1, 2000));
    } else {
      setBodyWeight(normalize(kgToLbs(bodyWeight), 1, 1000));
      setLiftedWeight(normalize(kgToLbs(liftedWeight), 1, 5000));
    }
    setUnits(newUnits);
  };

  const [wilksCoefficient, wilks] = useMemo(() => {
    const coefficient = calculateWilks(toKg(bodyWeight, units), sex, method);
    return [coefficient, toKg(liftedWeight, units) * coefficient];
  }, [bodyWeight, liftedWeight, sex, method, units]);

  return (
    <Stack spacing={2}>
      <ToggleButtonGroup value={sex} onChange={(_, v) => v && setSex(v as TSex)} exclusive fullWidth>
        <ToggleButton value="male">
          <Male sx={{ mr: '0.5em' }} />
          Mężczyzna
        </ToggleButton>
        <ToggleButton value="female">
          <Female sx={{ mr: '0.5em' }} />
          Kobieta
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup value={units} onChange={(_, v) => v && handleUnitsChange(v as TUnits)} exclusive fullWidth>
        <ToggleButton value="kg">Kilogramy</ToggleButton>
        <ToggleButton value="lbs">Funty</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup value={method} onChange={(_, v) => v && setMethod(v as TMethod)} exclusive fullWidth>
        <ToggleButton value="original">Oryginalny</ToggleButton>
        <ToggleButton value="new">Nowy (2020)</ToggleButton>
      </ToggleButtonGroup>
      <NumberField
        label="Masa ciała"
        value={bodyWeight}
        onChange={(event) => setBodyWeight(+event.target.value)}
        slotProps={{
          htmlInput: { min: 1, max: units === 'kg' ? 500 : 1000, step: units === 'kg' ? 0.5 : 1 },
          input: { endAdornment: <InputAdornment position="end">{units}</InputAdornment> },
        }}
        onFocus={(event) => event.target.select()}
      />
      <NumberField
        label="Podniesiony ciężar"
        value={liftedWeight}
        onChange={(event) => setLiftedWeight(+event.target.value)}
        slotProps={{
          htmlInput: { min: 1, max: units === 'kg' ? 2000 : 5000, step: units === 'kg' ? 0.5 : 1 },
          input: { endAdornment: <InputAdornment position="end">{units}</InputAdornment> },
        }}
        onFocus={(event) => event.target.select()}
      />
      <TextField
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" sx={{ color: 'text.secondary' }} onClick={() => setHelp('points')}>
                  <HelpOutline />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        label="Współczynnik Wilks'a"
        value={wilksCoefficient.toFixed(4)}
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
        label="Punkty Wilks'a"
        value={wilks.toFixed(3)}
      />
      {help === 'coefficient' && (
        <WilksCoefficientHelp weight={bodyWeight} method={method} sex={sex} close={() => setHelp(undefined)} />
      )}
      {help === 'points' && (
        <WilksPointsHelp
          weight={bodyWeight}
          bodyWeight={bodyWeight}
          wilksCoefficient={wilksCoefficient}
          sex={sex}
          close={() => setHelp(undefined)}
        />
      )}
    </Stack>
  );
};

export default Wilks;
