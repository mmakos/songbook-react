import { FC } from 'react';
import NumberField from '../NumberField.tsx';

export interface ISpacing {
  lineHeight: number; // em
  verseSpacing: number; // em
  verseIndent: number; // ch
  repetitionSpacing: number; // ch
  chordsSpacing: number; // ch
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
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: maxWidth }}>
      <NumberField
        disabled={disabled}
        value={spacing.lineHeight}
        onChange={(event) => lineHeightChanged(+event.target.value)}
        label="Interlinia"
        type="number"
        sx={{ mb: '1em' }}
        slotProps={{ htmlInput: { min: 1, max: 3, step: 0.1 } }}
      />
      <NumberField
        disabled={disabled}
        value={spacing.verseSpacing}
        onChange={(event) => verseSpacingChanged(+event.target.value)}
        label="Odstęp między zwrotkami"
        type="number"
        sx={{ mb: '1em' }}
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: 0, max: 3, step: 0.1 } }}
      />
      <NumberField
        disabled={disabled}
        value={spacing.verseIndent}
        onChange={(event) => verseIndentChanged(+event.target.value)}
        label="Wcięcie refrenów"
        type="number"
        sx={{ mb: '1em' }}
        slotProps={{ htmlInput: { min: 0, max: 10, step: 0.5 } }}
      />
      <NumberField
        disabled={disabled}
        value={spacing.repetitionSpacing}
        onChange={(event) => repetitionSpacingChanged(+event.target.value)}
        label="Odległość repetycji"
        type="number"
        sx={{ mb: '1em' }}
        slotProps={{ htmlInput: { min: 0, max: 10, step: 0.5 } }}
      />
      <NumberField
        disabled={disabled}
        value={spacing.chordsSpacing}
        onChange={(event) => chordsSpacingChanged(+event.target.value)}
        label="Odległość akordów"
        type="number"
        slotProps={{ htmlInput: { min: 0, max: 10, step: 0.5 } }}
      />
    </div>
  );
};

export default FontSpacing;
