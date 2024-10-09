import { FC, useEffect, useState } from 'react';
import { Collapse, IconButton, Paper } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { setSongVideoOpen } from '../store/songbook.reducer.ts';

const SongVideo: FC = () => {
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
  }

  return (
    <Collapse in={open && !!song?.ytVideo} collapsedSize={0} onExited={handleCollapse}>
      {(open || !collapsed) && song?.ytVideo && (
        <Paper sx={{ position: 'relative', mb: '0.5em', padding: '1em 1em' }}>
          <div data-video={song.ytVideo[0]} data-autoplay="0" data-loop="1" id="youtube-audio"></div>
          <script src="https://www.youtube.com/iframe_api"></script>
          <script src="https://cdn.rawgit.com/labnol/files/master/yt.js"></script>
          <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '1.5em' }}>
            {song.ytVideo.map((ytId, i) => (
              <iframe
                key={ytId}
                width={560}
                height={315}
                src={`https://www.youtube.com/embed/${ytId}`}
                title={'Nagranie piosenki ' + song.title}
                allowFullScreen
                style={{ marginBottom: song.ytVideo && i < song.ytVideo.length - 1 ? '1em' : undefined, border: 0 }}
              />
            ))}
          </div>
          <IconButton sx={{ position: 'absolute', top: '0.2em', right: '0.2em' }} size="small" onClick={close}>
            <Close />
          </IconButton>
        </Paper>
      )}
    </Collapse>
  );
};

export default SongVideo;
