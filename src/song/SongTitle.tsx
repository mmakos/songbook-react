import { Fade, IconButton, Skeleton, Typography } from '@mui/material';
import { InfoOutlined, Link } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { FC, useState } from 'react';
import { notifySuccess, setSongInfoOpen, setSongSettingsOpen } from '../store/songbook.reducer.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';
import { SettingsIcon } from '../components/SettingsIcon.tsx';

const SongTitle: FC = () => {
  const song = useAppSelector((state) => state.song);
  const noChords = useAppSelector((state) => state.songbookSettings.noChords);
  const [hover, setHover] = useState(false);
  const dispatch = useAppDispatch();

  const openSettings = () => {
    dispatch(setSongSettingsOpen(true));
  };

  const openInfo = () => {
    dispatch(setSongInfoOpen(true));
  };

  const copyUrlToString = () => {
    if (!song) return;
    navigator.clipboard.writeText(window.location.protocol + '//' + window.location.host + '/songs/' + song.id);
    dispatch(notifySuccess('Skopiowano link do piosenki do schowka'));
  };

  if (!song) return <Skeleton height="4em" />;

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em', marginTop: '1em' }}
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
      <div style={{ marginLeft: 'auto' }}>
        {!noChords && (
          <BasicTooltip title="Ustawienia wyświetlania piosenki">
            <IconButton onClick={openSettings}>
              <SettingsIcon />
            </IconButton>
          </BasicTooltip>
        )}
        <BasicTooltip title="Informacje o piosence">
          <IconButton onClick={openInfo}>
            <InfoOutlined />
          </IconButton>
        </BasicTooltip>
      </div>
    </div>
  );
};

export default SongTitle;
