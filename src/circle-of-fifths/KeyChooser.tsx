import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { FC, useState } from 'react';
import CircleOfFifths from './CircleOfFifths.tsx';
import { IKey } from '../types/song.types.ts';
import { keyAsString } from '../chords/chord-display.tsx';

interface IKeyChooserProps {
  chosenKey?: IKey;
  setChosenKey: (key?: IKey) => void;
}

const KeyChooser: FC<IKeyChooserProps & TextFieldProps> = ({ chosenKey, setChosenKey, ...props }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [signAccidentals, setSignAccidentals] = useState(true);

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <TextField
        {...props}
        value={chosenKey ? keyAsString(chosenKey) : ''}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setDialogOpen(true)}>
                  <Edit />
                </IconButton>
              </InputAdornment>
            ),
            readOnly: true,
          },
        }}
      />
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Koło kwintowe</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <CircleOfFifths
            required={props.required}
            chosenKey={chosenKey}
            setChosenKey={setChosenKey}
            letterAccidentals={!signAccidentals}
          />
        </DialogContent>
        <DialogActions>
          <Stack direction="row" sx={{ alignItems: 'center', mr: 'auto', ml: '0.5em' }}>
            <Typography>Fis</Typography>
            <Switch checked={signAccidentals} onChange={(e) => setSignAccidentals(e.target.checked)} />
            <Typography>F♯</Typography>
          </Stack>
          <Button onClick={() => setDialogOpen(false)}>Zapisz</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KeyChooser;
