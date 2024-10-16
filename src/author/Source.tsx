import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { useEffect, useMemo } from 'react';
import { getSource } from '../store/songbook.actions.ts';
import { useParams } from 'react-router-dom';
import { clearSource } from '../store/songbook.reducer.ts';
import { Divider, Link, Paper, Typography, useTheme } from '@mui/material';
import RouteLink from '../components/RouteLink.tsx';
import InfoUrlIcon from './InfoUrlIcon.tsx';
import SourceTypeIcon from './SourceTypeIcon.tsx';
import { sourceTypeAblative, sourceTypeNominative } from './source.utils.ts';
import Progress from '../components/Progress.tsx';

const Source = () => {
  const dispatch = useAppDispatch();
  const source = useAppSelector((state) => state.source);
  const { sourceSlug } = useParams();
  const theme = useTheme();

  useEffect(() => {
    sourceSlug && dispatch(getSource(sourceSlug));
  }, [sourceSlug]);

  useEffect(() => {
    return () => {
      dispatch(clearSource());
    };
  }, []);

  const songs = useMemo(() => {
    if (!source.songs) return;
    const s = [...source.songs];
    s.sort((a, b) => a.title.localeCompare(b.title));
    return s;
  }, [source.songs]);

  if (!source.source) return <Progress />;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.5em',
        marginTop: '1em',
        minWidth: '50%',
      }}
    >
      <div style={{ flex: 1 }}>
        <Typography variant="h4" mb="0.5rem">
          <SourceTypeIcon sx={{ mr: '0.3em' }} type={source.source.type} />
          {source.source.name}
        </Typography>
        {source.source.url && (
          <Paper sx={{ padding: '0.5em 1em', marginBottom: '0.5em', display: 'flex', flexDirection: 'column' }}>
            <Typography>
              {`${sourceTypeNominative(source.source.type)} "${source.source.name}"${source.source.year && ' z roku ' + source.source.year}`}
            </Typography>
            <div style={{ display: 'flex', marginTop: '0.5em' }}>
              <InfoUrlIcon url={source.source.url} sx={{ mr: '0.3em' }} />
              <Link href={source.source.url} color="inherit" underline="hover" target="_blank" rel="noopener">
                Więcej informacje o {sourceTypeAblative(source.source.type)}
              </Link>
            </div>
            {source.imageUrl && (
              <>
                <Divider sx={{ my: '0.5em' }} />
                <a href={source.imageUrl} target="_blank" rel="noopener">
                  <img
                    src={source.imageUrl}
                    style={{
                      height: '240px',
                      borderRadius: theme.shape.borderRadius,
                      border: 'solid',
                      borderColor: theme.palette.divider,
                    }}
                    alt={source.source.name}
                  />
                </a>
              </>
            )}
          </Paper>
        )}
        {songs && (
          <Paper sx={{ display: 'flex', flexDirection: 'column', padding: '0.5em 1em' }}>
            <Typography variant="h5">Piosenki</Typography>
            <Divider sx={{ my: '0.5em' }} />
            {songs.map((song) => (
              <RouteLink key={song.slug} lineHeight={1.75} color={'textPrimary'} to={`/song/${song.slug}`}>
                {song.title}
              </RouteLink>
            ))}
          </Paper>
        )}
      </div>
    </div>
  );
};

export default Source;
