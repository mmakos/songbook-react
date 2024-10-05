import { ClickAwayListener, Collapse, FormControlLabel, IconButton, Paper, Switch } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { Close, ExpandMore, SaveOutlined } from '@mui/icons-material';
import { FC, useState } from 'react';
import {
  changeSongChordsDifficulty,
  resetTransposition,
  setShowChords,
  setSongSettingsOpen,
  transposeDown,
  transposeUp,
  updateGlobalSettingsWithSongSettings,
} from '../store/songbook.reducer.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';
import ChordTransposition from '../settings/chord/ChordTransposition.tsx';
import ChordDifficultyPreset from '../settings/chord/ChordDifficultyPreset.tsx';
import ChordDifficulty from '../settings/chord/ChordDifficulty.tsx';

const SongSettings: FC = () => {
  const song = useAppSelector((state) => state.song);
  const open = useAppSelector((state) => state.songDisplayState.settingsOpen);
  const { transposition, chordDifficulty, showChords } = useAppSelector((state) => state.songSettings);
  const dispatch = useAppDispatch();
  const [moreSettings, setMoreSettings] = useState(false);

  const close = () => {
    dispatch(setSongSettingsOpen(false));
  };

  return (
    <ClickAwayListener onClickAway={() => setMoreSettings(false)}>
      <Collapse in={open && !!song} collapsedSize={0}>
        {song && (
          <Paper
            sx={{ position: 'relative', mb: '0.5em', padding: '0.5em 1em', display: 'flex', flexDirection: 'column' }}
          >
            <FormControlLabel
              control={<Switch checked={showChords} onChange={(_, value) => dispatch(setShowChords(value))} />}
              label="Pokaż akordy"
            />
            {song.key && (
              <ChordTransposition
                originalKey={song.key.songbook}
                transposition={transposition}
                onTransposeDown={() => dispatch(transposeDown())}
                onTransposeUp={() => dispatch(transposeUp())}
                onReset={() => dispatch(resetTransposition())}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', margin: '0.5em 0' }}>
              <ChordDifficultyPreset
                chordDifficulty={chordDifficulty}
                changeDifficulty={(difficulty) => dispatch(changeSongChordsDifficulty(difficulty))}
              />
              <IconButton sx={{ ml: 'auto' }} onClick={() => setMoreSettings(!moreSettings)} size="small">
                <ExpandMore
                  sx={{
                    rotate: moreSettings ? '180deg' : 0,
                    transitionProperty: 'rotate',
                    transitionDuration: '1sec',
                  }}
                />
              </IconButton>
            </div>
            <Collapse in={moreSettings}>
              <ChordDifficulty
                chordDifficulty={chordDifficulty}
                changeDifficulty={(difficulty) => dispatch(changeSongChordsDifficulty(difficulty))}
              />
            </Collapse>

            <div style={{ position: 'absolute', top: '0.2em', right: '0.2em' }}>
              <BasicTooltip title="Zapisz ustawienia globalnie">
                <IconButton onClick={() => dispatch(updateGlobalSettingsWithSongSettings())} size="small">
                  <SaveOutlined />
                </IconButton>
              </BasicTooltip>
              <IconButton onClick={close} size="small">
                <Close />
              </IconButton>
            </div>
          </Paper>
        )}
      </Collapse>
    </ClickAwayListener>
  );
};

export default SongSettings;
