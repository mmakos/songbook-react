import { getCoefficientsTable, TWilksMethod, TSex } from './wilks.calc.ts';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from '@mui/material';
import { FC } from 'react';

interface IWilksCoefficientHelpProps {
  weight: number;
  method: TWilksMethod;
  sex: TSex;
  close: () => void;
}

const Exponential = ({ n }: { n: number }) => {
  const s = n.toExponential().split('e');
  if (s.length < 2) return s;
  return (
    <>
      {s[0]}×10<sup>{s[1]}</sup>
    </>
  );
};

const WilksCoefficientHelp: FC<IWilksCoefficientHelpProps> = ({ weight, method, sex, close }) => {
  const coefficientsTable = getCoefficientsTable(method);
  const coefficients = coefficientsTable[sex];

  return (
    <Dialog open={true} onClose={close}>
      <DialogTitle>Współczynnik Wilks'a</DialogTitle>
      <DialogContent>
        Współczynnik Wilks'a liczymy ze wzoru:
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: '0.5em' }}>
          <Typography>𝑊</Typography>
          <Typography>=</Typography>
          <Stack alignItems="center">
            𝑘
            <Divider sx={{ borderColor: 'text.primary', width: '100%' }} />
            <span>
              𝑎 + 𝑏𝑥<sup>2</sup> + 𝑐𝑥<sup>3</sup> + 𝑑𝑥
              <sup>4</sup> + 𝑒𝑥<sup>5</sup> + 𝑓𝑥<sup>6</sup>
            </span>
          </Stack>
          <Typography>,</Typography>
        </Stack>
        gdzie 𝑥 to twoja masa ciała w kilogramach ({weight}kg), a współczynniki{' '}
        {method === 'original' ? 'oryginalnej' : 'nowej'} formuły Wilks'a dla{' '}
        {sex === 'female' ? 'kobiety' : 'mężczyzny'} wynoszą:
        <Stack>
          <Typography>𝑘 = {coefficientsTable.numerator}</Typography>
          <Typography>𝑎 = {coefficients[0]}</Typography>
          <Typography>𝑏 = {coefficients[1]}</Typography>
          <Typography>𝑐 = {coefficients[2]}</Typography>
          <Typography>
            𝑑 = <Exponential n={coefficients[3]} />
          </Typography>
          <Typography>
            𝑒 = <Exponential n={coefficients[4]} />
          </Typography>
          <Typography>
            𝑓 = <Exponential n={coefficients[5]} />
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Zamknij</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WilksCoefficientHelp;
