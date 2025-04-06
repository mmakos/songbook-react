import { useEffect, useState } from 'react';
import { fetchAuthor } from './author.actions.ts';
import { useParams } from 'react-router';
import { Container, Divider, Link, Paper, Stack, Typography, useTheme } from '@mui/material';
import InfoUrlIcon from './InfoUrlIcon.tsx';
import { sourceTypeAblative, sourceTypeNominative } from './author.utils.ts';
import Progress from '../components/Progress.tsx';
import SongTable from '../song-list/SongTable.tsx';
import { ISource } from '../types/song.types.ts';
import EditorInfo from '../song/EditorInfo.tsx';
import useCanEdit from '../store/useCanEdit.hook.ts';
import RouteIconButton from '../components/RouteIconButton.tsx';
import { Edit, Verified } from '@mui/icons-material';
import WaitingEditsInfo from '../song/WaitingEditsInfo.tsx';
import BasicTooltip from '../components/BasicTooltip.tsx';

const Source = () => {
  const [source, setSource] = useState<ISource>();
  const [imageUrl, setImageUrl] = useState<string>();
  const { sourceSlug, username } = useParams();
  const { canEdit, canVerify } = useCanEdit();
  const theme = useTheme();

  const slugAndUser = `${sourceSlug}${username ? '/' + username : ''}`;

  const fetchSource = () => {
    if (!sourceSlug) return;
    fetchAuthor<ISource>(`source/${slugAndUser}/`, (source) => setSource(source), setImageUrl);
  };

  useEffect(() => {
    setSource(undefined);
    fetchSource();
  }, [sourceSlug]);

  useEffect(() => {
    fetchSource();
  }, [username]);

  if (!source) return <Progress />;

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" mb="0.5rem" display="flex">
        {source.name}
        {canEdit && (
          <BasicTooltip title="Edytuj źródło" style={{ marginLeft: 'auto' }}>
            <RouteIconButton to={`/edit/source/${slugAndUser}`}>
              <Edit />
            </RouteIconButton>
          </BasicTooltip>
        )}
        {canVerify && (source.waiting || !source.created.verified) && (
          <BasicTooltip title="Zweryfikuj oczekujące edycje">
            <RouteIconButton to={`/verify/source/${sourceSlug}`}>
              <Verified />
            </RouteIconButton>
          </BasicTooltip>
        )}
      </Typography>
      {source.url && (
        <Paper sx={{ padding: '0.5em 1em', marginBottom: '0.5em', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" spacing={1} useFlexGap justifyContent="space-between" flexWrap="wrap">
            <Stack spacing={1} justifyContent="space-between">
              <Typography>
                {`${sourceTypeNominative(source.type)} "${source.name}"${source.year && ' z roku ' + source.year}`}
              </Typography>
              <Stack direction="row" spacing={1}>
                <InfoUrlIcon url={source.url} />
                <Link href={source.url} color="inherit" underline="hover" target="_blank" rel="noopener">
                  Więcej informacje o {sourceTypeAblative(source.type)}
                </Link>
              </Stack>
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
                  }}
                  alt={source.name}
                />
              </a>
            )}
          </Stack>
          <Divider sx={{ my: '0.5em' }} />
          <EditorInfo prefix="Utworzono" editorInfo={source.created} />
          {source.edited && <EditorInfo prefix="Edytowano" editorInfo={source.edited} />}
          <WaitingEditsInfo waiting={source} routeTo={`/source/${sourceSlug}`} />
        </Paper>
      )}
      <Paper>
        <SongTable source={sourceSlug} />
      </Paper>
    </Container>
  );
};

export default Source;
