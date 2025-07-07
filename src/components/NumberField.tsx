import { TextField, TextFieldProps, useTheme } from '@mui/material';
import { FC } from 'react';

const NumberField: FC<TextFieldProps> = (props) => {
  const theme = useTheme();

  return (
    <TextField
      type="number"
      {...props}
      sx={{
        ...props.sx,
        colorScheme: theme.palette.mode,
      }}
    />
  );
};

export default NumberField;
