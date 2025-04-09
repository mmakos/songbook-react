import { FC, Fragment } from 'react';
import { Button, Collapse, IconButton, Paper, Typography } from '@mui/material';
import {
  Close,
  Groups,
  Lyrics,
  MusicNote,
  Piano,
  RecordVoiceOver,
  ThumbUpOutlined,
  Translate,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';
import { setSongInfoOpen, transposeToComfort, transposeToOriginal } from '../store/songbook.reducer.ts';
import { keyAsString } from '../chords/chord-display.tsx';
import RouteLink from '../components/RouteLink.tsx';
import { personAsString, sourceTypeGenitive } from '../author/author.utils.ts';
import SourceTypeIcon from '../author/SourceTypeIcon.tsx';
import { ISong } from '../types/song.types.ts';

const SongInfo: FC<{ song?: ISong }> = ({ song }) => {
  const open = useAppSelector((state) => state.songDisplayState.infoOpen);
  const noChords = useAppSelector((state) => state.songbookSettings.noChordInfo);
  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(setSongInfoOpen(false));
  };

  const children = [];

  if (song) {
    song.source?.forEach((source) => {
      children.push(
        <Typography key={source.slug} sx={{ display: 'flex', alignItems: 'center' }}>
          <BasicTooltip title={`Piosenka pochodzi ${sourceTypeGenitive(source.type)}`}>
            <SourceTypeIcon fontSize="inherit" sx={{ mr: '0.5em' }} type={source.type} />
          </BasicTooltip>
          <RouteLink to={`/source/${source.slug}`} underline="hover" color="textPrimary">
            {source.name}
          </RouteLink>
        </Typography>
      );
    });
    song.band &&
      children.push(
        <Typography key="band" sx={{ display: 'flex', alignItems: 'center' }}>
          <BasicTooltip title="Zespół">
            <Groups fontSize="inherit" sx={{ mr: '0.5em' }} />
          </BasicTooltip>
          <RouteLink to={`/band/${song.band.slug}`} underline="hover" color="textPrimary">
            {song.band.name}
          </RouteLink>
        </Typography>
      );
    song.performer &&
      children.push(
        <Typography key="performer" sx={{ display: 'flex', alignItems: 'center' }}>
          <BasicTooltip title="Wykonanie">
            <RecordVoiceOver fontSize="inherit" sx={{ mr: '0.5em' }} />
          </BasicTooltip>
          {song.performer.map((person, i) => (
            <Fragment key={person.slug}>
              <RouteLink to={`/person/${person.slug}`} underline="hover" color="textPrimary">
                {personAsString(person)}
              </RouteLink>
              {i < song.performer!.length - 1 && <>,&nbsp;</>}
            </Fragment>
          ))}
        </Typography>
      );
    song.composer &&
      children.push(
        <Typography key="composer" sx={{ display: 'flex', alignItems: 'center' }}>
          <BasicTooltip title="Muzyka">
            <MusicNote fontSize="inherit" sx={{ mr: '0.5em' }} />
          </BasicTooltip>
          {song.composer.map((person, i) => (
            <Fragment key={person.slug}>
              <RouteLink to={`/person/${person.slug}`} underline="hover" color="textPrimary">
                {personAsString(person)}
              </RouteLink>
              {i < song.composer!.length - 1 && <>,&nbsp;</>}
            </Fragment>
          ))}
        </Typography>
      );
    song.lyrics &&
      children.push(
        <Typography key="lyrics" sx={{ display: 'flex', alignItems: 'center' }}>
          <BasicTooltip title="Słowa">
            <Lyrics fontSize="inherit" sx={{ mr: '0.5em' }} />
          </BasicTooltip>
          {song.lyrics.map((person, i) => (
            <Fragment key={person.slug}>
              <RouteLink to={`/person/${person.slug}`} underline="hover" color="textPrimary">
                {personAsString(person)}
              </RouteLink>
              {i < song.lyrics!.length - 1 && <>,&nbsp;</>}
            </Fragment>
          ))}
        </Typography>
      );
    song.translation &&
      children.push(
        <Typography key="translation" sx={{ display: 'flex', alignItems: 'center' }}>
          <BasicTooltip title="Tłumaczenie">
            <Translate fontSize="inherit" sx={{ mr: '0.5em' }} />
          </BasicTooltip>
          {song.translation.map((person, i) => (
            <Fragment key={person.slug}>
              <RouteLink to={`/person/${person.slug}`} underline="hover" color="textPrimary">
                {personAsString(person)}
              </RouteLink>
              {i < song.translation!.length - 1 && <>,&nbsp;</>}
            </Fragment>
          ))}
        </Typography>
      );
    !noChords &&
      song.key &&
      (song.key.original || song.key.comfort) &&
      children.push(
        <div key="key" style={{ marginTop: children.length > 0 ? '0.5em' : 0, display: 'flex', alignItems: 'center' }}>
          {song.key.original && (
            <BasicTooltip title="Tonacja oryginalna">
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
              <BasicTooltip title="Tonacja wygodna do śpiewania">
                <Button
                  color="inherit"
                  startIcon={<ThumbUpOutlined />}
                  sx={{ textTransform: 'none', padding: '0 4px', ml: '0.3em' }}
                  onClick={() => dispatch(transposeToComfort())}
                >
                  {keyAsString(song.key.comfort)}{song.key.maxComfort && " - " + keyAsString(song.key.maxComfort)}
                </Button>
              </BasicTooltip>
            </>
          )}
        </div>
      );
  }

  return (
    <Collapse in={open && !!song} collapsedSize={0}>
      {song && (
        <Paper sx={{ position: 'relative', mb: '0.5em', padding: '0.5em 1em' }}>
          {children.length > 0 ? children : 'Brak informacji'}
          <IconButton sx={{ position: 'absolute', top: '0.2em', right: '0.2em' }} size="small" onClick={close}>
            <Close />
          </IconButton>
        </Paper>
      )}
    </Collapse>
  );
};

export default SongInfo;
