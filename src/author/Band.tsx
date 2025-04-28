import { useParams } from 'react-router';
import { Container, Divider, Link, Paper, Stack, Typography, useTheme } from '@mui/material';
import InfoUrlIcon from './InfoUrlIcon.tsx';
import Progress from '../components/Progress.tsx';
import { useEffect, useState } from 'react';
import { IBand } from '../types/song.types.ts';
import { fetchAuthor } from './author.actions.ts';
import EditorInfo from '../song/EditorInfo.tsx';
import RouteIconButton from '../components/RouteIconButton.tsx';
import { Edit, Verified } from '@mui/icons-material';
import useCanEdit from '../store/useCanEdit.hook.ts';
import WaitingEditsInfo from '../song/WaitingEditsInfo.tsx';
import BasicTooltip from '../components/BasicTooltip.tsx';
import SongList from '../song-list/SongList.tsx';

const Band = () => {
  const [band, setBand] = useState<IBand>();
  const [imageUrl, setImageUrl] = useState<string>();
  const { bandSlug, username } = useParams();
  const { canEdit, canVerify } = useCanEdit();
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
          <BasicTooltip title="Edytuj zespół" style={{ marginLeft: 'auto' }}>
            <RouteIconButton to={`/edit/band/${slugAndUser}`}>
              <Edit />
            </RouteIconButton>
          </BasicTooltip>
        )}
        {canVerify && (band.waiting || !band.created.verified) && (
          <BasicTooltip title="Zweryfikuj oczekujące edycje">
            <RouteIconButton to={`/verify/band/${bandSlug}`}>
              <Verified />
            </RouteIconButton>
          </BasicTooltip>
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
          <EditorInfo prefix="Dodano" editorInfo={band.created} />
          {band.edited && <EditorInfo prefix="Edytowano" editorInfo={band.edited} />}
          <WaitingEditsInfo waiting={band} routeTo={`/band/${bandSlug}`} />
        </Paper>
      )}
      <SongList band={bandSlug} />
    </Container>
  );
};

export default Band;
