import { IPerson } from '../types/song.types.ts';
import { FC, Fragment } from 'react';
import { Button, Collapse, IconButton, Paper, Skeleton, Typography } from '@mui/material';
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

const personAsString = (author: IPerson): string => {
  if (author.nickname && (author.forceNickname || author.nickname.includes(' '))) {
    return author.nickname;
  }
  let name = author.name + ' ';
  if (author.forceSecondName && author.secondName) {
    const split = author.secondName.split(' ');
    if (split.length == 1) {
      name += split[0];
    } else {
      name += split.map((s) => s[0] + '.').join('');
    }
  }
  if (author.nickname) {
    name += ` "${author.nickname}"`;
  }
  return name + ' ' + author.lastName;
};

const SongInfo: FC = () => {
  const song = useAppSelector((state) => state.song);
  const open = useAppSelector((state) => state.songDisplayState.infoOpen);
  const noChords = useAppSelector((state) => state.songbookSettings.noChordInfo);
  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(setSongInfoOpen(false));
  };

  const children = [];

  if (song) {
    song.band &&
      children.push(
        <BasicTooltip key="band" title="Zespół" placement="bottom-start">
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            <Groups fontSize="inherit" sx={{ mr: '0.5em' }} />
            <RouteLink to={`/band/${song.band.slug}`} underline="hover" color="textPrimary">
              {song.band.name}
            </RouteLink>
          </Typography>
        </BasicTooltip>
      );
    song.performer &&
      children.push(
        <BasicTooltip key="performer" title="Wykonanie" placement="bottom-start">
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            <RecordVoiceOver fontSize="inherit" sx={{ mr: '0.5em' }} />
            {song.performer.map((person, i) => (
              <Fragment key={person.slug}>
                <RouteLink to={`/person/${person.slug}`} underline="hover" color="textPrimary">
                  {personAsString(person)}
                </RouteLink>
                {i < song.performer!.length - 1 && <>,&nbsp;</>}
              </Fragment>
            ))}
          </Typography>
        </BasicTooltip>
      );
    song.composer &&
      children.push(
        <BasicTooltip key="composer" title="Muzyka" placement="bottom-start">
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            <MusicNote fontSize="inherit" sx={{ mr: '0.5em' }} />
            {song.composer.map((person, i) => (
              <Fragment key={person.slug}>
                <RouteLink to={`/person/${person.slug}`} underline="hover" color="textPrimary">
                  {personAsString(person)}
                </RouteLink>
                {i < song.composer!.length - 1 && <>,&nbsp;</>}
              </Fragment>
            ))}
          </Typography>
        </BasicTooltip>
      );
    song.lyrics &&
      children.push(
        <BasicTooltip key="lyrics" title="Słowa" placement="bottom-start">
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            <Lyrics fontSize="inherit" sx={{ mr: '0.5em' }} />
            {song.lyrics.map((person, i) => (
              <Fragment key={person.slug}>
                <RouteLink to={`/person/${person.slug}`} underline="hover" color="textPrimary">
                  {personAsString(person)}
                </RouteLink>
                {i < song.lyrics!.length - 1 && <>,&nbsp;</>}
              </Fragment>
            ))}
          </Typography>
        </BasicTooltip>
      );
    song.translation &&
      children.push(
        <BasicTooltip key="translation" title="Tłumaczenie" placement="bottom-start">
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            <Translate fontSize="inherit" sx={{ mr: '0.5em' }} />
            {song.translation.map((person, i) => (
              <Fragment key={person.slug}>
                <RouteLink to={`/person/${person.slug}`} underline="hover" color="textPrimary">
                  {personAsString(person)}
                </RouteLink>
                {i < song.translation!.length - 1 && <>,&nbsp;</>}
              </Fragment>
            ))}
          </Typography>
        </BasicTooltip>
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
                  {keyAsString(song.key.comfort)}
                </Button>
              </BasicTooltip>
            </>
          )}
        </div>
      );
  }

  return (
    <Collapse in={open} collapsedSize={0}>
      {song ? (
        <Paper sx={{ position: 'relative', mb: '0.5em', padding: '0.5em 1em' }}>
          {children.length > 0 ? children : 'Brak informacji'}
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
