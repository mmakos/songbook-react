import { TSex } from './wilks-calc.ts';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FC } from 'react';

interface IWilksCoefficientHelpProps {
  weight: number;
  bodyWeight: number;
  sex: TSex;
  wilksCoefficient: number;
  close: () => void;
}

const WilksCoefficientHelp: FC<IWilksCoefficientHelpProps> = ({ weight, bodyWeight, sex, wilksCoefficient, close }) => {
  return (
    <Dialog open={true} onClose={close}>
      <DialogTitle>Punkty Wilks'a</DialogTitle>
      <DialogContent>
        Punkty Wilks'a liczy się poprzez przemnożenie podniesionego ciężaru ({weight}kg) przez wyliczony dla twojej masy
        ciała ({bodyWeight}kg), płci ({sex === 'female' ? 'kobieta' : 'mężczyzna'}), współczynnik Wilks'a (
        {wilksCoefficient.toFixed(4)}).
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Zamknij</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WilksCoefficientHelp;
