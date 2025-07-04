import { IconButton, TextField } from '@mui/material';
import { ArrowDownward, ArrowUpward, Cached } from '@mui/icons-material';
import { FC, useMemo } from 'react';
import { IKey } from '../../types/song.types.ts';
import { ITransposition, transposeKey } from '../../chords/chord-transposition.tsx';
import { keyAsString } from '../../chords/chord-display.tsx';

interface IChordTranspositionProps {
  originalKey: IKey;
  transposition: ITransposition;
  onTransposeDown: () => void;
  onTransposeUp: () => void;
  onReset: () => void;
  disabled?: boolean;
}

const ChordTransposition: FC<IChordTranspositionProps> = ({
  originalKey,
  transposition,
  onTransposeDown,
  onTransposeUp,
  onReset,
  disabled,
}) => {
  const keyString = useMemo(() => {
    return keyAsString(transposeKey(originalKey, transposition));
  }, [transposition, originalKey]);

  return (
    <TextField
      value={keyString}
      size="small"
      label="Tonacja"
      margin="normal"
      slotProps={{
        input: {
          endAdornment: (
            <>
              <IconButton onClick={onTransposeDown} size="small" disabled={disabled}>
                <ArrowDownward />
              </IconButton>
              <IconButton onClick={onTransposeUp} size="small" disabled={disabled}>
                <ArrowUpward />
              </IconButton>
              <IconButton onClick={onReset} size="small" disabled={disabled}>
                <Cached />
              </IconButton>
            </>
          ),
        },
      }}
      disabled={disabled}
    />
  );
};

export default ChordTransposition;
