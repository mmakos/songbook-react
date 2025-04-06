import { useParams } from 'react-router';
import { Container, Divider, Link, Paper, Stack, Typography, useTheme } from '@mui/material';
import InfoUrlIcon from './InfoUrlIcon.tsx';
import Progress from '../components/Progress.tsx';
import SongTable from '../song-list/SongTable.tsx';
import { useEffect, useState } from 'react';
import { IBand } from '../types/song.types.ts';
import { fetchAuthor } from './author.actions.ts';
import EditorInfo from '../song/EditorInfo.tsx';
import RouteIconButton from '../components/RouteIconButton.tsx';
import { Edit } from '@mui/icons-material';
import useCanEdit from '../store/useCanEdit.hook.ts';
import WaitingEditsInfo from '../song/WaitingEditsInfo.tsx';

const Band = () => {
  const [band, setBand] = useState<IBand>();
  const [imageUrl, setImageUrl] = useState<string>();
  const { bandSlug, username } = useParams();
  const { canEdit } = useCanEdit();
  const theme = useTheme();

  const slugAndUser = `${bandSlug}${username ? '/' + username : ''}`;

  const fetchBand = () => {
    if (!bandSlug) return;
    fetchAuthor<IBand>(`band/${slugAndUser}/`, (band) => setBand(band), setImageUrl);
  };

  useEffect(() => {
    setBand(undefined);
    fetchBand();
  }, [bandSlug]);

  useEffect(() => {
    fetchBand();
  }, [username]);

  if (!band) return <Progress />;

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" mb="0.5rem" display="flex">
        {band.name}
        {canEdit && (
          <RouteIconButton to={`/edit/band/${slugAndUser}`} sx={{ ml: 'auto' }}>
            <Edit />
          </RouteIconButton>
        )}
      </Typography>
      {band.url && (
        <Paper sx={{ padding: '0.5em 1em', marginBottom: '0.5em', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" spacing={1}>
            <InfoUrlIcon url={band.url} />
            <Link href={band.url} color="inherit" underline="hover" target="_blank" rel="noopener">
              Więcej informacje o zespole
            </Link>
          </Stack>
          {imageUrl && (
            <a href={imageUrl} target="_blank" rel="noopener">
              <img
                src={imageUrl}
                style={{
                  height: '240px',
                  borderRadius: theme.shape.borderRadius,
                  border: 'solid',
                  borderColor: theme.palette.divider,
                  marginTop: '1em',
                }}
                alt={band.name}
              />
            </a>
          )}
          <Divider sx={{ my: '0.5em' }} />
          <EditorInfo prefix="Utworzono" editorInfo={band.created} />
          {band.edited && <EditorInfo prefix="Edytowano" editorInfo={band.edited} />}
          <WaitingEditsInfo waiting={band} routeTo={`/band/${bandSlug}`} />
        </Paper>
      )}
      <Paper>
        <SongTable band={bandSlug} />
      </Paper>
    </Container>
  );
};

export default Band;
