import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { useEffect } from 'react';
import { getBand } from '../store/songbook.actions.ts';
import { useParams } from 'react-router-dom';
import { clearBand } from '../store/songbook.reducer.ts';
import { Divider, Link, Paper, Typography, useTheme } from '@mui/material';
import RouteLink from '../components/RouteLink.tsx';
import InfoUrlIcon from './InfoUrlIcon.tsx';

const Band = () => {
  const dispatch = useAppDispatch();
  const band = useAppSelector((state) => state.band);
  const { bandSlug } = useParams();
  const theme = useTheme();

  useEffect(() => {
    bandSlug && dispatch(getBand(bandSlug));
  }, [bandSlug]);

  useEffect(() => {
    return () => {
      dispatch(clearBand());
    };
  }, []);

  if (!band.band) return;

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
          {band.band.name}
        </Typography>
        {band.band.url && (
          <Paper sx={{ padding: '0.5em 1em', marginBottom: '0.5em', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              <InfoUrlIcon url={band.band.url} sx={{ mr: '0.3em' }} />
              <Link href={band.band.url} color="inherit" underline="hover" target="_blank" rel="noopener">
                Więcej informacje o zespole
              </Link>
            </div>
            {band.imageUrl && (
              <>
                <Divider sx={{ my: '0.5em' }} />
                <a href={band.imageUrl} target="_blank" rel="noopener">
                  <img
                    src={band.imageUrl}
                    style={{
                      height: '240px',
                      borderRadius: theme.shape.borderRadius,
                      border: 'solid',
                      borderColor: theme.palette.divider,
                    }}
                    alt={band.band.name}
                  />
                </a>
              </>
            )}
          </Paper>
        )}
        {band.songs && (
          <Paper sx={{ display: 'flex', flexDirection: 'column', padding: '0.5em 1em' }}>
            <Typography variant="h5">Piosenki</Typography>
            <Divider sx={{ my: '0.5em' }} />
            {band.songs.map((song) => (
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

export default Band;
