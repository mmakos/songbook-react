import { Box, ListItemButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FC, ReactNode } from 'react';
import { TSongFullOverview } from '../types/song.types.ts';
import EditorInfo from '../song/EditorInfo.tsx';
import { useNavigate } from 'react-router';
import SongInfo from '../song/SongInfo.tsx';

const LargeLayout: FC<{ title: ReactNode; editor: ReactNode; info: ReactNode }> = ({ title, editor, info }) => {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" width="100%">
        {title}
        <Stack alignItems="end">{editor}</Stack>
      </Stack>
      <Stack direction="row" spacing={2} display="inline-block">
        {info}
      </Stack>
    </>
  );
};

const SmallLayout: FC<{ title: ReactNode; editor: ReactNode; info: ReactNode }> = ({ title, editor, info }) => {
  return (
    <>
      {title}
      <Stack direction="row" display="inline-block">
        {info}
      </Stack>
      <Stack>{editor}</Stack>
    </>
  );
};

const SongListElement: FC<{ song: TSongFullOverview }> = ({ song }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const Layout = downMd ? SmallLayout : LargeLayout;

  return (
    <ListItemButton onClick={() => navigate(`/song/${song.slug}`)}>
      <Stack width="100%" spacing={1}>
        <Layout
          title={
            <Box display="inline-block">
              <Typography variant="h5" mr={song.altTitle ? '0.5em' : 0} display="inline">
                {song.title}
              </Typography>
              {song.altTitle && (
                <Typography variant="h5" color="text.secondary" display="inline">
                  ({song.altTitle})
                </Typography>
              )}
            </Box>
          }
          editor={
            <>
              <EditorInfo prefix="Dodano" editorInfo={song.created} />
              {song.edited && <EditorInfo prefix="Edytowano" editorInfo={song.edited} />}
            </>
          }
          info={
            <SongInfo song={song} sx={{ display: 'inline-block', mr: '1em' }} disableLinks color="text.secondary" />
          }
        />
      </Stack>
    </ListItemButton>
  );
};

export default SongListElement;
