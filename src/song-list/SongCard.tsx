import { Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';
import SongInfo from '../song/SongInfo.tsx';
import EditorInfo from '../song/EditorInfo.tsx';
import { FC } from 'react';
import { TSongFullOverview } from '../types/song.types.ts';
import { useNavigate } from 'react-router';

const SongCard: FC<{ song: TSongFullOverview }> = ({ song }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea sx={{ height: '100%' }} onClick={() => navigate(`/song/${song.slug}`)}>
        <CardContent sx={{ height: '100%' }}>
          <Stack spacing={2} justifyContent="space-between" height={{ height: '100%' }}>
            <Stack>
              <Typography variant="h5">{song.title}</Typography>
              {song.altTitle && (
                <Typography variant="h6" color="text.secondary">
                  {song.altTitle}
                </Typography>
              )}
            </Stack>
            <Stack>
              <SongInfo song={song} sx={{ display: 'inline-block' }} disableLinks />
            </Stack>
            <Stack>
              <EditorInfo prefix="Dodano" editorInfo={song.created} />
              {song.edited && <EditorInfo prefix="Edytowano" editorInfo={song.edited} />}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SongCard;
