import { IAuthor } from '../types/song.types.ts';
import { FC } from 'react';
import { Button, Collapse, IconButton, Paper, Skeleton, Typography } from '@mui/material';
import { Close, Lyrics, MusicNote, Piano, RecordVoiceOver, ThumbUpOutlined, Translate } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';
import { setSongInfoOpen, transposeToComfort, transposeToOriginal } from '../store/songbook.reducer.ts';
import { keyAsString } from '../chords/chord-display.tsx';

const authorAsString = (author: IAuthor): string => {
  if (author.lastName) {
    return author.name + ' ' + author.lastName;
  } else {
    return author.name;
  }
};

const SongInfo: FC = () => {
  const song = useAppSelector((state) => state.song);
  const open = useAppSelector((state) => state.songDisplayState.infoOpen);
  const noChords = useAppSelector((state) => state.songbookSettings.noChords);
  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(setSongInfoOpen(false));
  };

  console.log(song?.key)

  return (
    <Collapse in={open} collapsedSize={0}>
      {song ? (
        <Paper sx={{ position: 'relative', mb: '0.5em', padding: '0.5em 1em' }}>
          {song.performers && (
            <BasicTooltip title={'Wykonanie'} placement="bottom-start">
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <RecordVoiceOver fontSize="inherit" sx={{ mr: '0.5em' }} />
                {song.performers.map(authorAsString).join(', ')}
              </Typography>
            </BasicTooltip>
          )}
          {song.lyrics && (
            <BasicTooltip title={'Słowa'} placement="bottom-start">
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <Lyrics fontSize="inherit" sx={{ mr: '0.5em' }} />
                {song.lyrics.map(authorAsString).join(', ')}
              </Typography>
            </BasicTooltip>
          )}
          {song.translation && (
            <BasicTooltip title={'Tłumaczenie'} placement="bottom-start">
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <Translate fontSize="inherit" sx={{ mr: '0.5em' }} />
                {song.translation.map(authorAsString).join(', ')}
              </Typography>
            </BasicTooltip>
          )}
          {song.composer && (
            <BasicTooltip title={'Muzyka'} placement="bottom-start">
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <MusicNote fontSize="inherit" sx={{ mr: '0.5em' }} />
                {song.composer.map(authorAsString).join(', ')}
              </Typography>
            </BasicTooltip>
          )}
          {(!noChords && song.key && (song.key.original || song.key.comfort)) && (
            <div style={{ marginTop: '0.5em', display: 'flex', alignItems: 'center' }}>
              {song.key.original && (
                <BasicTooltip title={'Tonacja oryginalna'}>
                  <Button
                    color="inherit"
                    startIcon={<Piano />}
                    sx={{ textTransform: 'none', padding: '0 4px' }}
                    onClick={() => dispatch(transposeToOriginal())}
                  >
                    {keyAsString(song.key.original)}
                  </Button>
                </BasicTooltip>
              )}
              {song.key.comfort && (
                <>
                  {!song.key.original && <Piano fontSize="small" />}
                  <BasicTooltip title={'Tonacja wygodna do śpiewania'}>
                    <Button
                      color="inherit"
                      startIcon={<ThumbUpOutlined />}
                      sx={{ textTransform: 'none', padding: '0 4px', ml: '0.3em' }}
                      onClick={() => dispatch(transposeToComfort())}
                    >
                      {keyAsString(song.key.comfort)}
                    </Button>
                  </BasicTooltip>
                </>
              )}
            </div>
          )}
          <IconButton sx={{ position: 'absolute', top: '0.2em', right: '0.2em' }} size="small" onClick={close}>
            <Close />
          </IconButton>
        </Paper>
      ) : (
        <Skeleton height="5em" />
      )}
    </Collapse>
  );
};

export default SongInfo;
