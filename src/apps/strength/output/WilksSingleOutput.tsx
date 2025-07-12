import { TUnits } from '../units.ts';
import { Exercise, toFixed } from '../Wilks.tsx';
import ExerciseOutput from './ExerciseOutput.tsx';
import { FC, useState } from 'react';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { ScoreMethod, TScore, TSex } from '../wilks.calc.ts';
import { InfoOutlined } from '@mui/icons-material';
import OneRepMaxInfo from '../info/OneRepMaxInfo.tsx';
import { MaxRepMethod } from '../reps.calc.ts';
import PercentageInfo from '../info/PercentageInfo.tsx';
import WilksInfo from '../info/WilksInfo.tsx';

export interface ILifterResults {
  name: string;
  sex: TSex;
  bodyWeight: number;
  liftedWeights: [number, number][];
  maxWeights: number[];
  maxWeight: number;
  score?: TScore;
}

interface IWilksSingleOutputProps {
  exercise: Exercise;
  results: ILifterResults;
  others: ILifterResults[];
  units: TUnits;
  oneRepMaxMethod: MaxRepMethod;
  single?: boolean;
}

type TInfo = '1rm' | '%' | 'wilks' | 'wilks2020' | 'dots';

const WilksSingleOutput: FC<IWilksSingleOutputProps> = ({
  results,
  others,
  units,
  exercise,
  oneRepMaxMethod,
  single,
}) => {
  const weight = toFixed(results.maxWeight);
  const percentageScore = toFixed(results.score?.[ScoreMethod.PERCENTAGE], 1);
  const [info, setInfo] = useState<TInfo>();

  return (
    <Stack direction={{ xs: single ? 'column' : 'row', sm: 'column' }} spacing={{ xs: 1, sm: 2 }} width="100%">
      {exercise === Exercise.POWERLIFT && <ExerciseOutput lifter={results} exercise={exercise} units={units} />}
      <TextField
        size="small"
        label={exercise === Exercise.POWERLIFT ? 'Suma trójboju' : '1RM'}
        value={weight && `${weight} ${units}`}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={!weight} onClick={() => setInfo('1rm')} edge="end">
                  <InfoOutlined />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: '10em' }}
      />
      <TextField
        size="small"
        label="% masy ciała"
        value={percentageScore && `${percentageScore} %`}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={!percentageScore} onClick={() => setInfo('%')} edge="end">
                  <InfoOutlined />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: '10em' }}
      />
      <TextField
        size="small"
        label="Punkty Wilks'a"
        value={toFixed(results.score?.[ScoreMethod.WILKS], 3)}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={!weight} onClick={() => setInfo('wilks')} edge="end">
                  <InfoOutlined />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: '10em' }}
      />
      <TextField
        size="small"
        label="Punkty Wilks'a (2020)"
        value={toFixed(results.score?.[ScoreMethod.WILKS_2020], 3)}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={!percentageScore} onClick={() => setInfo('wilks2020')} edge="end">
                  <InfoOutlined />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: '10em' }}
      />
      <TextField
        size="small"
        label="Punkty DOTS"
        value={toFixed(results.score?.[ScoreMethod.DOTS], 3)}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={!percentageScore} onClick={() => setInfo('dots')} edge="end">
                  <InfoOutlined />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: '10em' }}
      />
      {info === '1rm' && (
        <OneRepMaxInfo
          results={results}
          others={others}
          inputIdx={0}
          method={oneRepMaxMethod}
          units={units}
          close={() => setInfo(undefined)}
        />
      )}
      {info === '%' && (
        <PercentageInfo
          results={results}
          others={others}
          inputIdx={0}
          method={oneRepMaxMethod}
          units={units}
          close={() => setInfo(undefined)}
        />
      )}
      {info === 'wilks' && (
        <WilksInfo
          title="Punkty Wilks'a"
          results={results}
          others={others}
          inputIdx={0}
          rmMethod={oneRepMaxMethod}
          scoreMethod={ScoreMethod.WILKS}
          units={units}
          close={() => setInfo(undefined)}
        />
      )}
      {info === 'wilks2020' && (
        <WilksInfo
          title="Punkty Wilks'a (2020)"
          results={results}
          others={others}
          inputIdx={0}
          rmMethod={oneRepMaxMethod}
          scoreMethod={ScoreMethod.WILKS_2020}
          units={units}
          close={() => setInfo(undefined)}
        />
      )}
      {info === 'dots' && (
        <WilksInfo
          title="Punkty DOTS"
          results={results}
          others={others}
          inputIdx={0}
          rmMethod={oneRepMaxMethod}
          scoreMethod={ScoreMethod.DOTS}
          units={units}
          close={() => setInfo(undefined)}
        />
      )}
    </Stack>
  );
};

export default WilksSingleOutput;
