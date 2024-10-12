import { FC, useEffect, useState } from 'react';
import { Collapse, IconButton, Paper, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { setSongVideoOpen } from '../store/songbook.reducer.ts';

const SongVideo: FC = () => {
  const theme = useTheme();
  const song = useAppSelector((state) => state.song);
  const open = useAppSelector((state) => state.songDisplayState.videoOpen);
  const [collapsed, setCollapsed] = useState(!open);
  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(setSongVideoOpen(false));
  };

  useEffect(() => {
    if (open) {
      setCollapsed(false);
    }
  }, [open]);

  const handleCollapse = () => {
    setCollapsed(true);
  };

  return (
    <Collapse in={open && !!song?.ytVideo} collapsedSize={0} onExited={handleCollapse}>
      {(open || !collapsed) && song?.ytVideo && (
        <Paper sx={{ position: 'relative', mb: '0.5em', padding: '1em 1em' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {song.ytVideo.map((ytId, i) => (
              <iframe
                key={ytId}
                width="100%"
                src={`https://www.youtube.com/embed/${ytId}`}
                title={'Nagranie piosenki ' + song.title}
                allowFullScreen
                style={{
                  marginBottom: song.ytVideo && i < song.ytVideo.length - 1 ? '1em' : undefined,
                  border: 0,
                  borderRadius: theme.shape.borderRadius,
                  maxWidth: '500px',
                  aspectRatio: '16 / 9',
                }}
              />
            ))}
          </div>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.2em', background: 'inherit', borderRadius: '50%' }}>
            <IconButton size="small" onClick={close}>
              <Close />
            </IconButton>
          </div>
        </Paper>
      )}
    </Collapse>
  );
};

export default SongVideo;
