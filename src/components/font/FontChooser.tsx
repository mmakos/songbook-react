import { FormControl, InputAdornment, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import NumberField from '../NumberField.tsx';

export enum FontFamily {
  ARIAL = 'Arial',
  CALIBRI = 'Calibri',
  DIALOG = 'Dialog',
  COURIER = 'Courier',
  VERDANA = 'Verdana',
  ROBOTO = 'Roboto',
  HELVETIVA = 'Helvetica',
  TAHOMA = 'Tahoma',
  TREBUCHET_MS = 'Trebuchet MS',
  TIMES_NEW_ROMAN = 'Times New Roman',
  GEORGIA = 'Georgia',
  GARAMOND = 'Garamond',
  COURIER_NEW = 'Courier New',
}

export interface IFont {
  fontFamily: FontFamily;
  fontSize: number;
}

interface IFontChooserProps {
  value: IFont;
  onChange: (value: IFont) => void;
  disabled?: boolean;
  maxWidth?: string;
  pt?: boolean;
}

const FontChooser: FC<IFontChooserProps> = ({ value: font, onChange: setFont, disabled, maxWidth, pt }) => {
  const fontFamilyChanged = (fontFamily: FontFamily) => {
    setFont({ ...font, fontFamily: fontFamily });
  };

  const fontSizeChanged = (fontSize: number) => {
    setFont({ ...font, fontSize: fontSize });
  };

  return (
    <Stack direction="row" maxWidth={maxWidth} sx={{flexGrow: 1}}>
      <FormControl fullWidth>
        <InputLabel id="font-select-label">Czcionka</InputLabel>
        <Select
          disabled={disabled}
          onChange={(event) => fontFamilyChanged(event.target.value as FontFamily)}
          value={font.fontFamily}
          label="Czcionka"
        >
          {Object.values(FontFamily).map((family) => (
            <MenuItem key={family} value={family}>
              <Typography sx={{ fontFamily: family }}>{family}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <NumberField
        disabled={disabled}
        label="Rozmiar"
        type="number"
        onChange={(event) => fontSizeChanged(+event.target.value)}
        value={font.fontSize}
        sx={{ ml: '0.5em', minWidth: '12ch' }}
        slotProps={{
          htmlInput: { min: 1, max: 100 },
          input: { endAdornment: <InputAdornment position="end">{pt ? 'pt' : 'px'}</InputAdornment>},
        }}
      />
    </Stack>
  );
};

export default FontChooser;
