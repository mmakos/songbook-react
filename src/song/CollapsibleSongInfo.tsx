import { Collapse, IconButton, Paper, Stack } from '@mui/material';
import { Close } from '@mui/icons-material';
import { setSongInfoOpen } from '../store/songbook.reducer.ts';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import SongInfo from './SongInfo.tsx';
import { FC } from 'react';
import { ISongFullOverview } from '../types/song.types.ts';

const CollapsibleSongInfo: FC<{ song?: ISongFullOverview }> = ({ song }) => {
  const open = useAppSelector((state) => state.songDisplayState.infoOpen);
  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(setSongInfoOpen(false));
  };

  return (
    <Collapse in={open && !!song} collapsedSize={0} unmountOnExit>
      {song && (
        <Paper sx={{ position: 'relative', padding: '0.5em 1em' }}>
          <Stack>
            <SongInfo song={song} sx={{ display: 'inline-block' }} />
          </Stack>
          <IconButton sx={{ position: 'absolute', top: '0.2em', right: '0.2em' }} size="small" onClick={close}>
            <Close />
          </IconButton>
        </Paper>
      )}
    </Collapse>
  );
};

export default CollapsibleSongInfo;
