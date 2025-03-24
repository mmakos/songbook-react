import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { FC } from 'react';

interface IKeyChooserProps {
  required?: boolean;
  label?: string;
  helperText?: string;
}

const KeyChooser: FC<IKeyChooserProps> = ({ required, label, helperText }) => {
  return (
    <TextField
        required={required}
      label={label}
      helperText={helperText}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <Edit />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default KeyChooser;
