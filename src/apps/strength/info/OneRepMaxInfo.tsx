import { ILifterResults } from '../output/WilksSingleOutput.tsx';
import { FC } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack } from '@mui/material';
import { latexFormulas, MaxRepMethod } from '../reps.calc.ts';
import { BlockMath, InlineMath } from 'react-katex';
import OneRepMaxCompare from './OneRepMaxCompare.tsx';
import { TUnits } from '../units.ts';

interface IOneRepMaxInfoProps {
  results: ILifterResults;
  others: ILifterResults[];
  inputIdx: number;
  method: MaxRepMethod;
  units: TUnits;
  close: () => void;
}

const OneRepMaxInfo: FC<IOneRepMaxInfoProps> = ({ results, others, inputIdx, method, units, close }) => {
  return (
    <Dialog open={true} onClose={close}>
      <DialogTitle>Maksymalny ciężar na 1 powtórzenie</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <div>
            Ciężar maksymalny został obliczony ze wzoru:
            <BlockMath>{latexFormulas[method]}</BlockMath>
            gdzie <InlineMath math={`w = ${results.liftedWeights[inputIdx][0]}`} /> (ciężar),{' '}
            <InlineMath math={`r = ${results.liftedWeights[inputIdx][1]}`} /> (liczba powtórzeń).
          </div>
          {!!others.length && <Divider />}
          {others.map((other) => (
            <OneRepMaxCompare results={results} other={other} inputIdx={inputIdx} method={method} units={units} />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Zamknij</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OneRepMaxInfo;
