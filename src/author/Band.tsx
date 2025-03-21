import { useParams } from 'react-router';
import { Container, Divider, Link, Paper, Typography, useTheme } from '@mui/material';
import InfoUrlIcon from './InfoUrlIcon.tsx';
import Progress from '../components/Progress.tsx';
import SongTable from '../song-list/SongTable.tsx';
import { useEffect, useState } from 'react';
import { IBand } from '../types/song.types.ts';
import { fetchAuthor } from './author.actions.ts';

const Band = () => {
  const [band, setBand] = useState<IBand>();
  const [imageUrl, setImageUrl] = useState<string>();
  const { bandSlug } = useParams();
  const theme = useTheme();

  const fetchBand = () => {
    if (!bandSlug) return;
    fetchAuthor(`band/${bandSlug}/`, (band) => setBand(band as IBand), setImageUrl);
  };

  useEffect(() => {
    setBand(undefined);
    fetchBand();
  }, [bandSlug]);

  if (!band) return <Progress />;

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" mb="0.5rem">
        {band.name}
      </Typography>
      {band.url && (
        <Paper sx={{ padding: '0.5em 1em', marginBottom: '0.5em', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex' }}>
            <InfoUrlIcon url={band.url} sx={{ mr: '0.3em' }} />
            <Link href={band.url} color="inherit" underline="hover" target="_blank" rel="noopener">
              Więcej informacje o zespole
            </Link>
          </div>
          {imageUrl && (
            <>
              <Divider sx={{ my: '0.5em' }} />
              <a href={imageUrl} target="_blank" rel="noopener">
                <img
                  src={imageUrl}
                  style={{
                    height: '240px',
                    borderRadius: theme.shape.borderRadius,
                    border: 'solid',
                    borderColor: theme.palette.divider,
                  }}
                  alt={band.name}
                />
              </a>
            </>
          )}
        </Paper>
      )}
      <Paper>
        <SongTable band={bandSlug} />
      </Paper>
    </Container>
  );
};

export default Band;
