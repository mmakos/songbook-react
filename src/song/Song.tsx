import { FC, useMemo } from 'react';
import { Box, Divider, Paper, Skeleton, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import EditorInfo from './EditorInfo.tsx';
import SongTitle from './SongTitle.tsx';
import SongSettings from './SongSettings.tsx';
import SongRoute from './SongRoute.tsx';
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
import GlobalSongContent from './GlobalSongContent.tsx';
import { SkipNext } from '@mui/icons-material';
import RouteIconButton from '../components/RouteIconButton.tsx';
import BasicTooltip from '../components/BasicTooltip.tsx';

const Song: FC<{ song?: ISong; preview?: boolean }> = ({ song, preview }) => {
  const meeting = useMeeting();
  const dispatch = useAppDispatch();
  const noChords = useAppSelector((state) => state.songbookSettings.noChordInfo);
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const songTheme = useSongTheme();

  const nextSong = useMemo(() => {
    if (preview || !meeting || !song) return;
    const currentIdx = meeting.songs.findIndex((s) => s.slug === song.slug);
    if (currentIdx >= 0) return meeting.songs[(currentIdx + 1) % meeting.songs.length].slug;
  }, [song, preview, meeting]);

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
              <GlobalSongContent song={song} />
            </ThemeProvider>
            <Divider variant="middle" />
            <div style={{ position: 'relative' }}>
              <Stack padding="0.5em 1em">
                {song ? <EditorInfo prefix="Dodano" editorInfo={song.created} /> : <Skeleton />}
                {song?.edited && <EditorInfo prefix="Edytowano" editorInfo={song.edited} />}
                {song && <WaitingEditsInfo waiting={song} routeTo={`/song/${song.slug}`} />}
              </Stack>
              {nextSong && (
                <BasicTooltip title={'Następna piosenka ze śpiewanek'}>
                  <RouteIconButton
                    sx={{ position: 'absolute', right: '0.5em', top: '50%', transform: 'translateY(-50%)' }}
                    to={`/song/${nextSong}`}
                  >
                    <SkipNext />
                  </RouteIconButton>
                </BasicTooltip>
              )}
            </div>
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
                currentSong={song?.slug}
              />
            </Box>
          </Box>
        )}
        {!preview && meeting && downMd && (
          <MeetingSongsPaper
            meeting={meeting}
            songsChanged={(songs) => dispatch(setMeeting({ ...meeting, songs }))}
            showName
            currentSong={song?.slug}
          />
        )}
      </Stack>
    </div>
  );
};

export default Song;
