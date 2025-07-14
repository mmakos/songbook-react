import { ILifterResults } from '../output/WilksSingleOutput.tsx';
import { MaxRepMethod } from '../reps.calc.ts';
import { TUnits } from '../units.ts';
import { FC } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack } from '@mui/material';
import { BlockMath, InlineMath } from 'react-katex';
import ScoreCompare from './ScoreCompare.tsx';
import { coefficientsTables, ScoreMethod } from '../wilks.calc.ts';

interface IWilksInfoProps {
  title: string;
  results: ILifterResults;
  others: ILifterResults[];
  inputIdx: number;
  rmMethod: MaxRepMethod;
  scoreMethod: ScoreMethod;
  units: TUnits;
  close: () => void;
}

const toExponential = (n: number) => {
  const s = n.toExponential().split('e');
  if (s.length < 2) return s[0];
  return `${s[0]} \\cdot 10^{${s[1]}}`;
};

const WilksInfo: FC<IWilksInfoProps> = ({ title, results, others, inputIdx, rmMethod, scoreMethod, units, close }) => {
  const coefficientsTable = coefficientsTables[scoreMethod];
  const coefficients = coefficientsTable[results.sex];
  let denominator = '';
  for (let i = 0; i < coefficients.length; ++i) {
    if (denominator !== '') denominator += ' + ';
    denominator += String.fromCharCode(97 + i);
    if (i > 0) denominator += 'm';
    if (i > 1) denominator += `^${i}`;
  }

  return (
    <Dialog open={true} onClose={close}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <div>
            {title} zostały obliczone ze wzoru:
            <BlockMath math={`P = \\frac{${coefficientsTable.numerator}}{${denominator}} \\cdot w`} />
            gdzie:
            <ul>
              <li>
                <InlineMath math={`w = ${results.maxWeight.toFixed(1)}`} /> (ciężar)
              </li>
              <li>
                <InlineMath math={`m = ${results.bodyWeight}`} /> (masa ciała)
              </li>
              {coefficients.map((c, i) => (
                <li key={'a' + i}>
                  <InlineMath math={`${String.fromCharCode(97 + i)} = ${Math.abs(c) < 0.001 ? toExponential(c) : c}`} />
                </li>
              ))}
            </ul>
          </div>
          {!!others.length && <Divider />}
          {others.map(
            (other, i) =>
              other.score && (
                <ScoreCompare
                  key={'o' + i}
                  results={results}
                  other={other}
                  inputIdx={inputIdx}
                  rmMethod={rmMethod}
                  scoreMethod={ScoreMethod.WILKS}
                  units={units}
                />
              )
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Zamknij</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WilksInfo;
