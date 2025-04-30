import { Fade, IconButton, Skeleton, Typography } from '@mui/material';
import { Link } from '@mui/icons-material';
import { useAppDispatch } from '../store/songbook.store.ts';
import { FC, useState } from 'react';
import { notifySuccess } from '../store/songbook.reducer.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';
import { ISong } from '../types/song.types.ts';

const SongTitle: FC<{ song?: ISong }> = ({ song }) => {
  const [hover, setHover] = useState(false);
  const dispatch = useAppDispatch();

  const copyUrlToString = () => {
    if (!song) return;
    navigator.clipboard.writeText(window.location.protocol + '//' + window.location.host + '/song/' + song.slug);
    dispatch(notifySuccess('Skopiowano link do piosenki do schowka'));
  };

  if (!song) return <Skeleton height="4em" />;

  return (
    <div
      style={{ display: 'inline-block', alignItems: 'center', marginBottom: '0.5em' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Typography variant="h4" display='inline'>
        {song.title}
      </Typography>
      {song.altTitle && (
        <Typography variant="h4" color="text.secondary" display='inline'>
          {' '}({song.altTitle})
        </Typography>
      )}
      <BasicTooltip title="Skopiuj link do schowka">
        <Fade in={hover} unmountOnExit>
          <IconButton onClick={copyUrlToString} sx={{ ml: '0.2em', verticalAlign: 'bottom' }}>
            <Link />
          </IconButton>
        </Fade>
      </BasicTooltip>
    </div>
  );
};

export default SongTitle;
