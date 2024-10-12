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
}

const ChordTransposition: FC<IChordTranspositionProps> = ({
  originalKey,
  transposition,
  onTransposeDown,
  onTransposeUp,
  onReset,
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
              <IconButton onClick={onTransposeDown} size="small">
                <ArrowDownward />
              </IconButton>
              <IconButton onClick={onTransposeUp} size="small">
                <ArrowUpward />
              </IconButton>
              <IconButton onClick={onReset} size="small">
                <Cached />
              </IconButton>
            </>
          ),
        },
      }}
    />
  );
};

export default ChordTransposition;
