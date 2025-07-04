import { Collapse, FormControlLabel, IconButton, Stack, Switch } from '@mui/material';
import { IChordDifficulty } from '../store/songbook.reducer.ts';
import ChordTransposition from '../settings/chord/ChordTransposition.tsx';
import ChordDifficultyPreset from '../settings/chord/ChordDifficultyPreset.tsx';
import { ExpandMore } from '@mui/icons-material';
import ChordDifficulty from '../settings/chord/ChordDifficulty.tsx';
import { FC } from 'react';
import { ISong } from '../types/song.types.ts';
import { ITransposition } from '../chords/chord-transposition.tsx';

interface ISongChordSettingsProps {
  song: ISong;
  moreSettings: boolean;
  setMoreSettings: (moreSettings: boolean) => void;
  showChords?: boolean;
  setShowChords: (showChords: boolean) => void;
  transposition: ITransposition;
  transposeDown: () => void;
  transposeUp: () => void;
  resetTransposition: () => void;
  chordDifficulty: IChordDifficulty;
  changeChordDifficulty: (difficulty: IChordDifficulty) => void;
  disabled?: boolean;
}

const SongChordSettings: FC<ISongChordSettingsProps> = ({
  song,
  moreSettings,
  setMoreSettings,
  showChords,
  setShowChords,
  transposition,
  transposeUp,
  transposeDown,
  resetTransposition,
  chordDifficulty,
  changeChordDifficulty,
  disabled,
}) => {
  return (
    <>
      <FormControlLabel
        control={<Switch checked={showChords} onChange={(_, value) => setShowChords(value)} />}
        label="Pokaż akordy"
        disabled={disabled}
      />
      {song.key && (
        <ChordTransposition
          originalKey={song.key.songbook}
          transposition={transposition}
          onTransposeDown={() => transposeDown()}
          onTransposeUp={() => transposeUp()}
          onReset={() => resetTransposition()}
          disabled={!showChords}
        />
      )}
      <Stack direction="row" my="0.5em" justifyContent="space-between">
        <ChordDifficultyPreset
          chordDifficulty={chordDifficulty}
          changeDifficulty={(difficulty) => changeChordDifficulty(difficulty)}
          disabled={disabled || !showChords}
        />
        <IconButton onClick={() => setMoreSettings(!moreSettings)} size="small">
          <ExpandMore
            sx={{
              rotate: moreSettings ? '180deg' : 0,
              transitionProperty: 'rotate',
              transitionDuration: '1sec',
            }}
          />
        </IconButton>
      </Stack>
      <Collapse in={moreSettings}>
        <ChordDifficulty
          chordDifficulty={chordDifficulty}
          changeDifficulty={(difficulty) => changeChordDifficulty(difficulty)}
          disabled={disabled || !showChords}
        />
      </Collapse>
    </>
  );
};

export default SongChordSettings;
