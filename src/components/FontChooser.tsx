import { Paper, Select, TextField, ToggleButton, Typography } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined } from '@mui/icons-material';
import { FC, MouseEvent, useMemo } from 'react';
import BasicTooltip from './BasicTooltip.tsx';
import StyledToggleButtonGroup from './StyledToggleButtonGroup.tsx';

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
  lineHeight: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

type TFontStyle = 'bold' | 'italic' | 'underline';

interface FontChooserProps {
  value: IFont;
  onChange: (value: IFont) => void;
  fontStyle?: TFontStyle[];
}

const FontRenderer = (value: FontFamily) => {
  return (
    <Typography
      color="textPrimary"
      style={{
        fontFamily: value,
        fontWeight: 'unset',
      }}
    >
      {value}
    </Typography>
  );
};

const FontChooser: FC<FontChooserProps> = ({
                                             value: font,
                                             onChange: setFont,
                                             fontStyle,
                                           }) => {
  const fontFamilyChanged = (fontFamily: FontFamily) => {
    setFont({ ...font, fontFamily: fontFamily });
  };

  const fontSizeChanged = (fontSize: number) => {
    setFont({ ...font, fontSize: fontSize });
  };

  const fontStyleChanged = (_event: MouseEvent<HTMLElement>, style: TFontStyle[]) => {
    setFont({
      ...font,
      bold: style.includes('bold'),
      italic: style.includes('italic'),
      underline: style.includes('underline'),
    });
  };

  const fontStyleArray = useMemo(() => {
    const fontStyle: TFontStyle[] = [];

    font.bold && fontStyle.push('bold');
    font.italic && fontStyle.push('italic');
    font.underline && fontStyle.push('underline');

    return fontStyle;
  }, [font]);

  return (
    <div style={{ display: 'flex' }}>
      <Select
        onChange={(event) => fontFamilyChanged(event.target.value as FontFamily)}
        values={Object.values(FontFamily)}
        selectedValue={font.fontFamily}
        label="Czcionka"
        renderItem={FontRenderer}
        sx={{
          fontWeight: font.bold ? 'bold' : 'normal',
          fontStyle: font.italic ? 'italic' : 'normal',
          textDecoration: font.underline ? 'underline' : 'none',
        }}
      />
      <TextField
        label="Rozmiar"
        type="number"
        onChange={(event) => fontSizeChanged(+event.target.value)}
        value={font.fontSize}
        sx={{ minWidth: '100px' }}
        slotProps={{ htmlInput: { min: 1, max: 100 } }}
      />
      {fontStyle && (
        <Paper
          style={{ backgroundColor: 'transparent' }}
          variant="outlined"
          sx={{
            marginTop: '12px',
            display: 'flex',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            flexWrap: 'wrap',
          }}
        >
          {fontStyle && (
            <StyledToggleButtonGroup value={fontStyleArray} onChange={fontStyleChanged}>
              {fontStyle.includes('bold') && (
                <BasicTooltip title="Pogrubienie">
                  <ToggleButton value="bold">
                    <FormatBold />
                  </ToggleButton>
                </BasicTooltip>
              )}
              {fontStyle.includes('italic') && (
                <BasicTooltip title="Kursywa">
                  <ToggleButton value="italic">
                    <FormatItalic />
                  </ToggleButton>
                </BasicTooltip>
              )}
              {fontStyle.includes('underline') && (
                <BasicTooltip title="Podkreślenie">
                  <ToggleButton value="underline">
                    <FormatUnderlined />
                  </ToggleButton>
                </BasicTooltip>
              )}
            </StyledToggleButtonGroup>
          )}
        </Paper>
      )}
    </div>
  );
};

export default FontChooser;
