import { FC } from 'react';
import NumberField from '../NumberField.tsx';
import { InputAdornment, Stack } from '@mui/material';

export interface ISpacing {
  lineHeight: number; // em
  verseSpacing: number; // em | pt
  verseIndent: number; // ch | pt
  repetitionSpacing: number; // ch | pt
  chordsSpacing: number; // ch | pt
  pt?: boolean;
}

interface IFontSpacingProps {
  spacing: ISpacing;
  setSpacing: (spacing: ISpacing) => void;
  disabled?: boolean;
  maxWidth?: string;
}

const FontSpacing: FC<IFontSpacingProps> = ({ spacing, setSpacing, disabled, maxWidth }) => {
  const lineHeightChanged = (lineHeight: number) => {
    setSpacing({ ...spacing, lineHeight });
  };

  const verseSpacingChanged = (verseSpacing: number) => {
    setSpacing({ ...spacing, verseSpacing });
  };

  const verseIndentChanged = (verseIndent: number) => {
    setSpacing({ ...spacing, verseIndent });
  };

  const repetitionSpacingChanged = (repetitionSpacing: number) => {
    setSpacing({ ...spacing, repetitionSpacing });
  };

  const chordsSpacingChanged = (chordsSpacing: number) => {
    setSpacing({ ...spacing, chordsSpacing });
  };

  return (
    <Stack maxWidth={maxWidth} spacing={2}>
      <NumberField
        disabled={disabled}
        value={spacing.lineHeight}
        onChange={(event) => lineHeightChanged(+event.target.value)}
        label="Interlinia"
        slotProps={{
          htmlInput: { min: 1, max: 3, step: 0.1 },
          input: { endAdornment: <InputAdornment position="end">em</InputAdornment> },
        }}
      />
      <NumberField
        disabled={disabled}
        value={spacing.verseSpacing}
        onChange={(event) => verseSpacingChanged(+event.target.value)}
        label="Odstęp między zwrotkami"
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { min: 0, max: spacing.pt ? 50 : 3, step: spacing.pt ? 1 : 0.1 },
          input: { endAdornment: <InputAdornment position="end">{spacing.pt ? 'pt' : 'em'}</InputAdornment> },
        }}
      />
      <NumberField
        disabled={disabled}
        value={spacing.verseIndent}
        onChange={(event) => verseIndentChanged(+event.target.value)}
        label="Wcięcie refrenów"
        slotProps={{
          htmlInput: { min: 0, max: spacing.pt ? 100 : 10, step: spacing.pt ? 1 : 0.5 },
          input: { endAdornment: <InputAdornment position="end">{spacing.pt ? 'pt' : 'ch'}</InputAdornment> },
        }}
      />
      <NumberField
        disabled={disabled}
        value={spacing.repetitionSpacing}
        onChange={(event) => repetitionSpacingChanged(+event.target.value)}
        label="Odległość repetycji"
        slotProps={{
          htmlInput: { min: 0, max: spacing.pt ? 100 : 10, step: spacing.pt ? 1 : 0.5 },
          input: { endAdornment: <InputAdornment position="end">{spacing.pt ? 'pt' : 'ch'}</InputAdornment> },
        }}
      />
      <NumberField
        disabled={disabled}
        value={spacing.chordsSpacing}
        onChange={(event) => chordsSpacingChanged(+event.target.value)}
        label="Odległość akordów"
        slotProps={{
          htmlInput: { min: 0, max: spacing.pt ? 100 : 10, step: spacing.pt ? 1 : 0.5 },
          input: { endAdornment: <InputAdornment position="end">{spacing.pt ? 'pt' : 'ch'}</InputAdornment> },
        }}
      />
    </Stack>
  );
};

export default FontSpacing;
