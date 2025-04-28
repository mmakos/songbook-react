import { FC } from 'react';
import { Box, Divider, Paper, Skeleton, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import EditorInfo from './EditorInfo.tsx';
import SongTitle from './SongTitle.tsx';
import SongSettings from './SongSettings.tsx';
import SongRoute from './SongRoute.tsx';
import SongContent from './SongContent.tsx';
import SongVideo from './SongVideo.tsx';
import SongControls from './SongControls.tsx';
import { ISong } from '../types/song.types.ts';
import WaitingEditsInfo from './WaitingEditsInfo.tsx';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import useSongTheme from '../store/useSongTheme.ts';
import useMeeting from '../store/useMeeting.ts';
import MeetingSongsPaper from '../meeting/MeetingSongsPaper.tsx';
import { setMeeting } from '../store/songbook.reducer.ts';
import CollapsibleSongInfo from './CollapsibleSongInfo.tsx';

const Song: FC<{ song?: ISong; preview?: boolean }> = ({ song, preview }) => {
  const meeting = useMeeting();
  const dispatch = useAppDispatch();
  const noChords = useAppSelector((state) => state.songbookSettings.noChordInfo);
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const songTheme = useSongTheme();

  return (
    <div style={{ position: 'relative', alignItems: 'center', maxWidth: '100%' }}>
      <SongTitle song={song} />
      <SongRoute song={song} />
      <div
        style={{
          marginBottom: '0.5em',
          display: 'flex',
          flexWrap: 'nowrap',
          overflow: 'auto',
          gap: '0.5em',
          scrollbarWidth: 'none',
        }}
      >
        <SongControls type="chip" preview={preview} />
      </div>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} useFlexGap>
        <Stack direction="column" spacing={1}>
          <CollapsibleSongInfo song={song} />
          <SongVideo song={song} />
          {!noChords && <SongSettings song={song} />}
          <Paper>
            <ThemeProvider theme={songTheme}>
              <SongContent song={song} />
            </ThemeProvider>
            <Divider variant="middle" />
            <Stack padding="0.5em 1em">
              {song ? <EditorInfo prefix="Dodano" editorInfo={song.created} /> : <Skeleton />}
              {song?.edited && <EditorInfo prefix="Edytowano" editorInfo={song.edited} />}
              {song && <WaitingEditsInfo waiting={song} routeTo={`/song/${song.slug}`} />}
            </Stack>
          </Paper>
        </Stack>
        {!preview && meeting && !downMd && (
          <Box sx={{ position: 'relative', flex: 1, minWidth: '20em' }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                overflow: 'auto',
              }}
            >
              <MeetingSongsPaper
                meeting={meeting}
                songsChanged={(songs) => dispatch(setMeeting({ ...meeting, songs }))}
                showName
              />
            </Box>
          </Box>
        )}
        {!preview && meeting && downMd && (
          <MeetingSongsPaper
            meeting={meeting}
            songsChanged={(songs) => dispatch(setMeeting({ ...meeting, songs }))}
            showName
          />
        )}
      </Stack>
    </div>
  );
};

export default Song;
