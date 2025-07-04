import { ClickAwayListener, Collapse, IconButton, Paper } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { Close, SaveOutlined } from '@mui/icons-material';
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
import { ISong } from '../types/song.types.ts';
import SongChordSettings from './SongChordSettings.tsx';

const SongSettings: FC<{ song?: ISong }> = ({ song }) => {
  const open = useAppSelector((state) => state.songDisplayState.settingsOpen);
  const { transposition, chordDifficulty, showChords } = useAppSelector((state) => state.songSettings);
  const dispatch = useAppDispatch();
  const [moreSettings, setMoreSettings] = useState(false);

  const close = () => {
    dispatch(setSongSettingsOpen(false));
  };

  return (
    <ClickAwayListener onClickAway={() => setMoreSettings(false)}>
      <Collapse in={open && !!song} collapsedSize={0} unmountOnExit>
        {song && (
          <Paper
            sx={{
              position: 'relative',
              padding: '0.5em 1em',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <SongChordSettings
              song={song}
              moreSettings={moreSettings}
              setMoreSettings={setMoreSettings}
              showChords={showChords}
              setShowChords={(show) => dispatch(setShowChords(show))}
              transposition={transposition}
              transposeDown={() => dispatch(transposeDown())}
              transposeUp={() => dispatch(transposeUp())}
              resetTransposition={() => dispatch(resetTransposition())}
              chordDifficulty={chordDifficulty}
              changeChordDifficulty={(difficulty) => dispatch(changeSongChordsDifficulty(difficulty))}
            />
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
