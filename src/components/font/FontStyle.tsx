import StyledToggleButtonGroup from '../StyledToggleButtonGroup.tsx';
import BasicTooltip from '../BasicTooltip.tsx';
import { Paper, SxProps, ToggleButton } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined } from '@mui/icons-material';
import { FC, MouseEvent, useMemo } from 'react';

type TFontStyle = 'bold' | 'italic' | 'underline';

export interface IFontStyle {
  italic?: boolean;
  bold?: boolean;
  underline?: boolean;
}

interface IFontStyleProps {
  fontStyle: IFontStyle;
  setFontStyle: (fontStyle: IFontStyle) => void;
  sx?: SxProps;
}

const FontStyle: FC<IFontStyleProps> = ({ fontStyle, setFontStyle, sx }) => {
  const fontStyleChanged = (_event: MouseEvent<HTMLElement>, style: TFontStyle[]) => {
    setFontStyle({
      bold: style.includes('bold'),
      italic: style.includes('italic'),
      underline: style.includes('underline'),
    });
  };

  const fontStyleArray = useMemo(() => {
    const array: TFontStyle[] = [];

    fontStyle.bold && array.push('bold');
    fontStyle.italic && array.push('italic');
    fontStyle.underline && array.push('underline');

    return array;
  }, [fontStyle]);

  return (
    <Paper
      style={{ backgroundColor: 'transparent' }}
      variant="outlined"
      sx={{
        ...sx,
        display: 'flex',
      }}
    >
      <StyledToggleButtonGroup value={fontStyleArray} onChange={fontStyleChanged}>
        <BasicTooltip title="Pogrubienie">
          <ToggleButton value="bold">
            <FormatBold />
          </ToggleButton>
        </BasicTooltip>
        <BasicTooltip title="Kursywa">
          <ToggleButton value="italic">
            <FormatItalic />
          </ToggleButton>
        </BasicTooltip>
        <BasicTooltip title="Podkreślenie">
          <ToggleButton value="underline">
            <FormatUnderlined />
          </ToggleButton>
        </BasicTooltip>
      </StyledToggleButtonGroup>
    </Paper>
  );
};

export default FontStyle;
