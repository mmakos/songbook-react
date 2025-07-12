import { ILifterResults } from '../output/WilksSingleOutput.tsx';
import { MaxRepMethod } from '../reps.calc.ts';
import { TUnits } from '../units.ts';
import { FC } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack } from '@mui/material';
import { BlockMath, InlineMath } from 'react-katex';
import ScoreCompare from './ScoreCompare.tsx';
import { ScoreMethod } from '../wilks.calc.ts';

interface IPercentageInfoProps {
  results: ILifterResults;
  others: ILifterResults[];
  inputIdx: number;
  method: MaxRepMethod;
  units: TUnits;
  close: () => void;
}

const PercentageInfo: FC<IPercentageInfoProps> = ({ results, others, inputIdx, method, units, close }) => {
  return (
    <Dialog open={true} onClose={close}>
      <DialogTitle>Procent masy ciała</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <div>
            Procent masy ciała został obliczony ze wzoru:
            <BlockMath math="P = \frac{w}{m} \cdot 100\%" />
            gdzie <InlineMath math={`w = ${results.maxWeight.toFixed(1)}`} /> (ciężar),{' '}
            <InlineMath math={`r = ${results.bodyWeight}`} /> (masa ciała).
          </div>
          {!!others.length && <Divider />}
          {others.map((other, i) => (
            <ScoreCompare
              key={'o' + i}
              results={results}
              other={other}
              inputIdx={inputIdx}
              rmMethod={method}
              scoreMethod={ScoreMethod.PERCENTAGE}
              units={units}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Zamknij</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PercentageInfo;
