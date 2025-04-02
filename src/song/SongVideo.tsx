import { FC } from 'react';
import {Collapse, IconButton, Paper, Stack, useTheme} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { setSongVideoOpen } from '../store/songbook.reducer.ts';
import { ISong } from '../types/song.types.ts';

const SongVideo: FC<{ song?: ISong }> = ({ song }) => {
  const theme = useTheme();
  const open = useAppSelector((state) => state.songDisplayState.videoOpen);
  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(setSongVideoOpen(false));
  };

  if (!song?.video) return;

  return (
    <Collapse in={open} collapsedSize={0} unmountOnExit>
      <Paper sx={{ position: 'relative', mb: '0.5em', padding: '1em 1em' }}>
        <Stack spacing={2}>
          {song.video.map((ytId) => (
            <iframe
              key={ytId}
              width="100%"
              src={`https://www.youtube.com/embed/${ytId}`}
              title={'Nagranie piosenki ' + song.title}
              allowFullScreen
              style={{
                border: 0,
                borderRadius: theme.shape.borderRadius,
                maxWidth: '500px',
                aspectRatio: '16 / 9',
              }}
            />
          ))}
        </Stack>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '0.2em',
            background: 'inherit',
            borderRadius: '50%',
          }}
        >
          <IconButton size="small" onClick={close}>
            <Close />
          </IconButton>
        </div>
      </Paper>
    </Collapse>
  );
};

export default SongVideo;
