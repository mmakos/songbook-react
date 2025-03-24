import { useEffect, useState } from 'react';
import { fetchAuthor } from './author.actions.ts';
import { useParams } from 'react-router';
import { Container, Divider, Link, Paper, Typography, useTheme } from '@mui/material';
import InfoUrlIcon from './InfoUrlIcon.tsx';
import SourceTypeIcon from './SourceTypeIcon.tsx';
import { sourceTypeAblative, sourceTypeNominative } from './author.utils.ts';
import Progress from '../components/Progress.tsx';
import SongTable from '../song-list/SongTable.tsx';
import { ISource } from '../types/song.types.ts';

const Source = () => {
  const [source, setSource] = useState<ISource>();
  const [imageUrl, setImageUrl] = useState<string>();
  const { sourceSlug } = useParams();
  const theme = useTheme();

  const fetchSource = () => {
    if (!sourceSlug) return;
    fetchAuthor(`source/${sourceSlug}/`, (source) => setSource(source as ISource), setImageUrl);
  };

  useEffect(() => {
    setSource(undefined);
    fetchSource();
  }, [sourceSlug]);

  if (!source) return <Progress />;

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" mb="0.5rem">
        <SourceTypeIcon sx={{ mr: '0.3em' }} type={source.type} />
        {source.name}
      </Typography>
      {source.url && (
        <Paper sx={{ padding: '0.5em 1em', marginBottom: '0.5em', display: 'flex', flexDirection: 'column' }}>
          <Typography>
            {`${sourceTypeNominative(source.type)} "${source.name}"${source.year && ' z roku ' + source.year}`}
          </Typography>
          <div style={{ display: 'flex', marginTop: '0.5em' }}>
            <InfoUrlIcon url={source.url} sx={{ mr: '0.3em' }} />
            <Link href={source.url} color="inherit" underline="hover" target="_blank" rel="noopener">
              Więcej informacje o {sourceTypeAblative(source.type)}
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
                  alt={source.name}
                />
              </a>
            </>
          )}
        </Paper>
      )}
      <Paper>
        <SongTable source={sourceSlug} />
      </Paper>
    </Container>
  );
};

export default Source;
