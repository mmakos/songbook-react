import { Fade, IconButton, Skeleton, Typography } from '@mui/material';
import { Link } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { FC, useState } from 'react';
import { notifySuccess } from '../store/songbook.reducer.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';

const SongTitle: FC = () => {
  const song = useAppSelector((state) => state.song);
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
      style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em'}}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Typography variant="h4">{song.title}</Typography>
      <BasicTooltip title="Skopiuj link do schowka">
        <Fade in={hover}>
          <IconButton onClick={copyUrlToString} sx={{ marginLeft: '0.2em' }}>
            <Link />
          </IconButton>
        </Fade>
      </BasicTooltip>
    </div>
  );
};

export default SongTitle;
