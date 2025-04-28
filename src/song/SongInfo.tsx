import { FC, Fragment, PropsWithChildren } from 'react';
import {Button, SxProps, Typography} from '@mui/material';
import { Groups, Lyrics, MusicNote, Piano, RecordVoiceOver, ThumbUpOutlined, Translate } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';
import { transposeToComfort, transposeToOriginal } from '../store/songbook.reducer.ts';
import { keyAsString } from '../chords/chord-display.tsx';
import { personAsString, sourceTypeGenitive } from '../author/author.utils.ts';
import SourceTypeIcon from '../author/SourceTypeIcon.tsx';
import { ISongFullOverview, ISongKey } from '../types/song.types.ts';
import RouteLink from '../components/RouteLink.tsx';

interface ISongInfoProps {
  song?: ISongFullOverview & { key?: ISongKey };
  disableLinks?: boolean;
  color?: string;
  sx?: SxProps;
}

const AuthorLink: FC<{ to: string; disabled?: boolean } & PropsWithChildren> = ({ to, disabled, children }) => {
  if (disabled) return children;

  return (
    <RouteLink to={to} underline="hover" color="textPrimary" display="inline">
      {children}
    </RouteLink>
  );
};

const SongInfo: FC<ISongInfoProps> = ({ song, disableLinks, color, sx }) => {
  const noChords = useAppSelector((state) => state.songbookSettings.noChordInfo);
  const dispatch = useAppDispatch();

  const children = [];

  if (song) {
    song.source?.forEach((source) => {
      children.push(
        <Typography key={source.slug} color={color} sx={sx}>
          <BasicTooltip title={`Piosenka pochodzi ${sourceTypeGenitive(source.type)}`}>
            <SourceTypeIcon fontSize="inherit" sx={{ mr: '0.5em', verticalAlign: 'text-top' }} type={source.type} />
          </BasicTooltip>
          <AuthorLink to={`/source/${source.slug}`} disabled={disableLinks}>
            {source.name}
          </AuthorLink>
        </Typography>
      );
    });
    song.band &&
      children.push(
        <Typography key="band" color={color} sx={sx}>
          <BasicTooltip title="Zespół">
            <Groups fontSize="inherit" sx={{ mr: '0.5em', verticalAlign: 'text-top' }} />
          </BasicTooltip>
          <AuthorLink to={`/band/${song.band.slug}`} disabled={disableLinks}>
            {song.band.name}
          </AuthorLink>
        </Typography>
      );
    song.performer &&
      children.push(
        <Typography key="performer" color={color} sx={sx}>
          <BasicTooltip title="Wykonanie">
            <RecordVoiceOver fontSize="inherit" sx={{ mr: '0.5em', verticalAlign: 'text-top' }} />
          </BasicTooltip>
          {song.performer.map((person, i) => (
            <Fragment key={person.slug}>
              <AuthorLink to={`/person/${person.slug}`} disabled={disableLinks}>
                {personAsString(person)}
              </AuthorLink>
              {i < song.performer!.length - 1 && <>{', '}</>}
            </Fragment>
          ))}
        </Typography>
      );
    song.composer &&
      children.push(
        <Typography key="composer" color={color} sx={sx}>
          <BasicTooltip title="Muzyka">
            <MusicNote fontSize="inherit" sx={{ mr: '0.5em', verticalAlign: 'text-top' }} />
          </BasicTooltip>
          {song.composer.map((person, i) => (
            <Fragment key={person.slug}>
              <AuthorLink to={`/person/${person.slug}`} disabled={disableLinks}>
                {personAsString(person)}
              </AuthorLink>
              {i < song.composer!.length - 1 && <>{', '}</>}
            </Fragment>
          ))}
        </Typography>
      );
    song.lyrics &&
      children.push(
        <Typography key="lyrics" color={color} sx={sx}>
          <BasicTooltip title="Słowa">
            <Lyrics fontSize="inherit" sx={{ mr: '0.5em', verticalAlign: 'text-top' }} />
          </BasicTooltip>
          {song.lyrics.map((person, i) => (
            <Fragment key={person.slug}>
              <AuthorLink to={`/person/${person.slug}`} disabled={disableLinks}>
                {personAsString(person)}
              </AuthorLink>
              {i < song.lyrics!.length - 1 && <>{', '}</>}
            </Fragment>
          ))}
        </Typography>
      );
    song.translation &&
      children.push(
        <Typography key="translation" color={color} sx={sx}>
          <BasicTooltip title="Tłumaczenie">
            <Translate fontSize="inherit" sx={{ mr: '0.5em', verticalAlign: 'text-top' }} />
          </BasicTooltip>
          {song.translation.map((person, i) => (
            <Fragment key={person.slug}>
              <AuthorLink to={`/person/${person.slug}`} disabled={disableLinks}>
                {personAsString(person)}
              </AuthorLink>
              {i < song.translation!.length - 1 && <>{', '}</>}
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
                  {keyAsString(song.key.comfort)}
                  {song.key.maxComfort && ' - ' + keyAsString(song.key.maxComfort)}
                </Button>
              </BasicTooltip>
            </>
          )}
        </div>
      );
  }

  return children.length > 0 ? children : <Typography color='text.secondary'>Brak informacji</Typography>;
};

export default SongInfo;
